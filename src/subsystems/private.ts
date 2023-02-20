import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import middie from '@fastify/middie';
import { jwtService } from '../api/services/jwt-services';
import { userServices } from '../api/services/user-services';
import { favoritesRouter } from '../api/routes/private/favorites-router';

export async function privateSystem(fastify: FastifyInstance) {
  fastify.register(middie, { hook: 'onRequest' });

  // Routes
  fastify.register(favoritesRouter);

  fastify.addHook('onRequest', async (req: FastifyRequest, res: FastifyReply) => {
    const token = req.headers.authorization;
    if (token) {
      const decoded = await jwtService.verifyToken(token);
      if (decoded) {
        const userExists = await userServices.findUser(decoded.email);
        if (userExists) {
          req.user = decoded;
        } else {
          res.status(401);
          return res.send('O usuario nao existe');
        }
      } else {
        res.status(401);
        return res.send('Token Invalido');
      }
    } else {
      res.status(401);
      return res.send('Token inexistente');
    }
  });
}
