import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user.controller';

async function userRouterAuth(fastify: FastifyInstance) {
  fastify.get(
    '/users/:id',
    {
      schema: {
        summary: 'Get user by ID',
        description: 'This route returns a user finded by ID',
        params: {
          id: {
            type: 'string',
            description: 'user id'
          }
        }
      }
    },
    userController.getOneUser
  );
  fastify.post('/users', userController.getAllUsers);
  fastify.post('/users/register', userController.registerAuth);
  fastify.put('/users/update', userController.updateUser);
  fastify.put('/users/admin/update/:id', userController.updateUserAsAdmin);
  fastify.put('/users/admin/p/update', userController.updatePasswordAsAdmin);
  fastify.put('/users/p/update', userController.updatePassword);
  fastify.delete('/users/admin/:id', userController.deleteOneUser);
  fastify.post('/users/account/confirm', userController.confirmAccount);
}

export { userRouterAuth };
