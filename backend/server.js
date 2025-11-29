// backend/server.js
import Fastify from 'fastify';
import FastifyStatic from '@fastify/static';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Импортируем роуты
import authRoutes from './src/routes/auth.js';
import adminRoutes from './src/routes/admin.js';
import timesheetRoutes from './src/routes/timesheet.js';
import exportRoutes from './src/routes/export.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

dotenv.config({ path: '.env.local' });

fastify.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL
});

fastify.register(FastifyStatic, {
  root: path.join(__dirname, '../public'),
});

// Регистрируем роуты
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(adminRoutes, { prefix: '/api/admin' });
fastify.register(timesheetRoutes, { prefix: '/api/timesheet' });
fastify.register(exportRoutes, { prefix: '/api/export' });

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();