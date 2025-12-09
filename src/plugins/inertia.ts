import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyReply } from 'fastify';
import path from 'path';
import fs from 'fs';

export interface InertiaOptions {
  isProduction: boolean;
  root: string;
  vite?: any;
  version?: string;
}

declare module 'fastify' {
  interface FastifyReply {
    renderInertia(component: string, props?: Record<string, any>): Promise<void>;
  }
}

const inertiaPlugin: FastifyPluginAsync<InertiaOptions> = async (fastify, options) => {
  const { isProduction, root, vite, version = '1.0.0' } = options;

  let templateCache: string | null = null;

  fastify.decorateReply('renderInertia', async function (component: string, props: Record<string, any> = {}) {
    const reply = this as FastifyReply;
    const request = reply.request;
    const url = request.raw.url || '';

    if (
      request.method === 'GET' &&
      request.headers['x-inertia'] &&
      request.headers['x-inertia-version'] !== version
    ) {
      return reply
        .status(409)
        .header('X-Inertia-Location', url)
        .send();
    }

    const page = {
      component,
      props,
      url,
      version,
    };

    if (request.headers['x-inertia']) {
      return reply
        .header('Content-Type', 'application/json')
        .header('X-Inertia', 'true')
        .header('Vary', 'Accept')
        .send(page);
    }

    let template = '';

    if (!isProduction && vite) {
      // Dev: Read index.html and let Vite transform it (inject HMR client, etc.)
      try {
        const templatePath = path.resolve(root, 'index.html');
        template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
      } catch (err) {
        request.log.error(err);
        return reply.status(500).send('Internal Server Error: Failed to load template');
      }
    } else {
      // Prod: Use cached template or read from built index.html
      if (!templateCache) {
        try {
          const templatePath = path.resolve(root, 'dist/client/index.html');
          templateCache = fs.readFileSync(templatePath, 'utf-8');
        } catch (err) {
          request.log.error(err);
          return reply.status(500).send('Internal Server Error: Template not found');
        }
      }
      template = templateCache;
    }

    const pageString = JSON.stringify(page).replace(/"/g, '&quot;');
    const html = template.replace(
      '<div id="app"></div>',
      `<div id="app" data-page="${pageString}"></div>`
    );

    return reply.type('text/html').send(html);
  });
};

export default fp(inertiaPlugin, {
  name: 'fastify-inertia-custom',
});
