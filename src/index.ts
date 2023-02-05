import * as dotenv from 'dotenv';
dotenv.config();
import fastify from 'fastify';
import { cityRoutes } from './api/routes/city-router.js';
import { communityRoutes } from './api/routes/community-router.js';
import { propertyRoutes } from './api/routes/property-router.js';
import { provinceRoutes } from './api/routes/province-router.js';

export const apiUrl = process.env.GMAPS_VALIDATE_ADDRESS_API_URL;
export const apiKey = process.env.GMAPS_VALIDATE_ADDRESS_API_KEY;

export const server = fastify({ logger: true });

server.register(provinceRoutes);
server.register(cityRoutes);
server.register(communityRoutes);
server.register(propertyRoutes);
