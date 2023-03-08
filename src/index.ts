import * as dotenv from 'dotenv';
dotenv.config();
import Fastify, { FastifyRequest } from 'fastify';
import JWT from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import { cityRoutes } from './api/routes/city-router.js';
import { communityRoutes } from './api/routes/community-router.js';
import { propertyRoutes } from './api/routes/property-router.js';
import { provinceRoutes } from './api/routes/province-router.js';
import { userRouter } from './api/routes/user-router.js';
import { privateSystem } from './subsystems/private.js';

export const apiUrl = process.env.GMAPS_VALIDATE_ADDRESS_API_URL;
export const apiKey = process.env.GMAPS_VALIDATE_ADDRESS_API_KEY;
const jwtSecret = process.env.JWT_SECRET;

export const fastify = Fastify({ logger: true, bodyLimit: 1024 * 1024 * 10, keepAliveTimeout: 20 });

fastify.register(JWT, {
  secret: jwtSecret!,
});
fastify.register(fastifyMultipart);
fastify.register(provinceRoutes);
fastify.register(cityRoutes);
fastify.register(communityRoutes);
fastify.register(propertyRoutes);
fastify.register(userRouter);

// Subsystems
fastify.register(privateSystem, { prefix: '/private' });
