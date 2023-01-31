import fastify from 'fastify';
import { cityRoutes } from './routes/city-router.js';
import { communityRoutes } from './routes/community-router.js';

import { provinceRoutes } from './routes/province-router.js';

export const server = fastify({ logger: true });

server.register(provinceRoutes);
server.register(cityRoutes);
server.register(communityRoutes);
