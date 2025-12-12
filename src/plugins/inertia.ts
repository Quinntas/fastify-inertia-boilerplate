import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyReply } from 'fastify';
import path from 'path';
import fs from 'fs';
import { InertiaPage, InertiaPageMap } from '../shared/inertia';

type InertiaProp<T> = T | Promise<T> | (() => T) | (() => Promise<T>);

type InertiaProps<T> = {
  [K in keyof T]: InertiaProp<T[K]>;
};

export interface InertiaOptions {
  isProduction: boolean;
  root: string;
  vite?: any;
  version?: string;
}

declare module 'fastify' {
  interface FastifyContextConfig {
    inertiaComponent?: InertiaPage;
  }

  interface FastifyReply {
    renderInertia<Page extends keyof InertiaPageMap>(
      component: Page,
      props?: InertiaProps<InertiaPageMap[Page]>
    ): Promise<void>;
  }
}

const inertiaPlugin: FastifyPluginAsync<InertiaOptions> = async (fastify, options) => {
  const { isProduction, root, vite, version = '1.0.0' } = options;

  let templateCache: string | null = null;

  fastify.decorateReply('renderInertia', async function (component: InertiaPage, props: Record<string, any> = {}) {
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

    // Support for partial reloads
    const partialComponent = request.headers['x-inertia-partial-component'];
    const partialDataHeader = request.headers['x-inertia-partial-data'];
    const partialData = typeof partialDataHeader === 'string' ? partialDataHeader.split(',') : [];

    let finalProps = props;

    if (partialComponent && partialComponent === component && partialData.length > 0) {
      finalProps = {};
      partialData.forEach((key) => {
        if (key in props) {
          finalProps[key] = props[key];
        }
      });
    }

    // Resolve promises and functions (lazy evaluation)
    const resolvedProps: Record<string, any> = {};
    for (const key in finalProps) {
      let value = finalProps[key];
      if (typeof value === 'function') {
        value = await value();
      } else if (value instanceof Promise) {
        value = await value;
      }
      resolvedProps[key] = value;
    }

    const page = {
      component,
      props: resolvedProps,
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
