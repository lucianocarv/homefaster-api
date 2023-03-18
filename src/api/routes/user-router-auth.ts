import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user-controller';

async function userRouterAuth(fastify: FastifyInstance) {
  fastify.get('/users/:id', userController.user);
  fastify.post('/users', userController.users);
  fastify.post('/users/register', userController.registerAuth);
  fastify.put('/users/update', userController.update);
  fastify.put('/users/admin/update/:id', userController.updateAsAdmin);
  fastify.put('/users/admin/p/update', userController.updatePasswordAsAdmin);
  fastify.put('/users/p/update', userController.updatePassword);
  fastify.delete('/users/admin/:id', userController.deleteUser);
}

export { userRouterAuth };
