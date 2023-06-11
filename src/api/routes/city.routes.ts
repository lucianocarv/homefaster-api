import { FastifyInstance } from 'fastify';
import { cityController } from '../controllers/city.controller';

async function cityRoutes(fastify: FastifyInstance) {
  fastify.get('/cities/top', cityController.getFeaturedCities);
  fastify.get('/cities/list', cityController.cityList);
  fastify.get('/cities/city-center', cityController.cityCenter);
}

export { cityRoutes };
