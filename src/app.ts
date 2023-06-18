import * as dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify';
import JWT from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import { propertyRoutes } from './api/routes/property.routes.js';
import { userRouter } from './api/routes/user.routes.js';
import { authenticatedSystem } from './config/subsystems/authenticated.js';
import { JWT_SECRET } from './config/environment.js';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import cors from '@fastify/cors';
import { cityRoutes } from './api/routes/city.routes.js';

export const fastify = Fastify({ logger: true, bodyLimit: 1024 * 1024 * 10, keepAliveTimeout: 20 });

fastify.register(cors, {
  origin: true
});
fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Homefaster API Swagger Documentation',
      description: 'Documentação da API',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: process.env.HOST_URL,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Properties', description: 'Endpoints para a administração e visualização das propriedades' },
      { name: 'Users', description: 'Endpoints para a administração, visualização e acessos dos usuários no sistema' }
    ]
  }
});
fastify.register(swaggerUi, {
  routePrefix: '/documentation',
  theme: {
    title: 'Homefaster Swagger Docs'
  },
  uiConfig: {
    deepLinking: true
  },
  staticCSP: true,
  transformStaticCSP: header => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true
});

fastify.register(JWT, {
  secret: JWT_SECRET
});
fastify.register(fastifyMultipart);
fastify.register(propertyRoutes);
fastify.register(userRouter);
fastify.register(cityRoutes);

// Subsystems
fastify.register(authenticatedSystem, { prefix: '/a' });
