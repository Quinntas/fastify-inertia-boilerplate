import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import fastifyStatic from '@fastify/static';
import middie from '@fastify/middie';
import path from 'path';
import { fileURLToPath } from 'url';
import inertiaPlugin from './plugins/inertia.js';
import { contactSchema } from './shared/contactSchema.js';
import { userParamsSchema, userQuerySchema } from './shared/userSchemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

const isProduction = process.env.NODE_ENV === 'production';

const users = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'admin' : i % 2 === 0 ? 'editor' : 'user',
}));

async function createServer() {
  const fastify = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });

      if (request.headers['x-inertia']) {
        return reply.status(422).send(errors);
      }

      if (request.routeOptions.config?.inertiaComponent) {
        return reply.status(422).renderInertia(request.routeOptions.config.inertiaComponent, { errors });
      }

      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        issues: error.issues,
      });
    }
    return reply.send(error);
  });

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
      name: 'Context7 User',
      timestamp: () => new Date().toISOString(),
    });
  });

  fastify.get('/about', async (_, reply) => {
    return reply.renderInertia('About');
  });

  fastify.get('/contact', async (_, reply) => {
    return reply.renderInertia('Contact');
  });

  fastify.get('/users', {
    schema: {
      querystring: userQuerySchema,
    },
    config: {
      inertiaComponent: 'Users',
    },
  }, async (request, reply) => {
    const { q, role, page, limit } = request.query;
    let filteredUsers = users;

    if (q) {
      const lowerQ = q.toLowerCase();
      filteredUsers = filteredUsers.filter((u) =>
        u.name.toLowerCase().includes(lowerQ) ||
        u.email.toLowerCase().includes(lowerQ)
      );
    }

    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter((u) => u.role === role);
    }

    // Simulate network delay for prefetching demonstration
    await new Promise((resolve) => setTimeout(resolve, 300));

    const total = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    const lastPage = Math.ceil(total / limit);

    return reply.renderInertia('Users', {
      users: paginatedUsers,
      filters: { q, role },
      meta: {
        total,
        page,
        lastPage,
        limit,
      },
    });
  });

  fastify.get('/users/:id', {
    schema: {
      params: userParamsSchema,
    },
    config: {
      inertiaComponent: 'UserDetail',
    },
  }, async (request, reply) => {
    const { id } = request.params;
    const user = users.find((u) => u.id === id);

    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    return reply.renderInertia('UserDetail', { user });
  });

  fastify.post('/contact', {
    schema: {
      body: contactSchema,
    },
    config: {
      inertiaComponent: 'Contact',
    },
  }, async (request, reply) => {
    const body = request.body;

    console.log('Contact form submitted:', body);

    return reply.redirect('/');
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
