import * as dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify';
import JWT from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import { propertyRoutes } from './api/routes/property.routes.js';
import { userRouter } from './api/routes/user.routes.js';
import { authenticatedSystem } from './api/config/subsystems/authenticated.js';
import { env_jwtSecret } from './environment.js';

export const fastify = Fastify({ logger: true, bodyLimit: 1024 * 1024 * 10, keepAliveTimeout: 20 });

fastify.register(JWT, {
  secret: env_jwtSecret ? env_jwtSecret : Buffer.byteLength('20').toString()
});
fastify.register(fastifyMultipart);
fastify.register(propertyRoutes);
fastify.register(userRouter);

// Subsystems
fastify.register(authenticatedSystem, { prefix: '/a' });
