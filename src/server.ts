import fastify from 'fastify';

import { provinceRoutes } from './routes/province-router.js';

export const server = fastify({ logger: true });

server.register(provinceRoutes);
