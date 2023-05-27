import { FastifyInstance } from 'fastify';
import { mapsController } from '../controllers/maps.controller';

async function mapsRoutesAuth(fastify: FastifyInstance) {
  fastify.get('/maps/geocode/address', mapsController.getAddress);
  fastify.post('/maps/validate-address/address', mapsController.validateAddress);
}
export { mapsRoutesAuth };
