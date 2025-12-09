import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import middie from '@fastify/middie';
import path from 'path';
import { fileURLToPath } from 'url';
import inertiaPlugin from './plugins/inertia';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

const isProduction = process.env.NODE_ENV === 'production';

async function createServer() {
  const fastify = Fastify({ logger: true });

  await fastify.register(middie);

  let vite: any;

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
    });

    fastify.use(vite.middlewares);
  } else {
    fastify.register(fastifyStatic, {
      root: path.join(root, 'dist/client'),
      wildcard: false,
    });
  }

  await fastify.register(inertiaPlugin, {
    isProduction,
    root,
    vite,
    version: '1.0.0', // In production, replace this with a build hash
  });

  fastify.get('/', async (_, reply) => {
    return reply.renderInertia('Home', {
      name: 'Context7 User'
    });
  });

  fastify.get('/about', async (_, reply) => {
    return reply.renderInertia('About');
  });

  try {
    const port = 3000;
    await fastify.listen({ port });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

createServer();
