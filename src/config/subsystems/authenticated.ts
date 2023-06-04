import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import middie from '@fastify/middie';
import { jwtService } from '../../api/services/jwt.services';
import { userServices } from '../../api/services/user.services';
import { favoritesRouter } from '../../api/routes/favorites.routes';
import { CustomError } from '../../api/helpers/custom-error';
import { propertyRoutesAuth } from '../../api/routes/property.auth.routes';
import { userRouterAuth } from '../../api/routes/user.auth.routes';
import { ERR_NEED_LOGIN } from '../../api/errors/permission.errors';
import { featureRoutesAuth } from '../../api/routes/feature.auth.routes';
import { utilitiesRoutesAuth } from '../../api/routes/utilities.auth.routes';
import { typesRoutesAuth } from '../../api/routes/types.auth.routes';
import { mapsRoutesAuth } from '../../api/routes/maps.auth.routes';

export async function authenticatedSystem(fastify: FastifyInstance) {
  fastify.register(middie, { hook: 'onRequest' });
  // Routes
  fastify.register(favoritesRouter);
  fastify.register(propertyRoutesAuth);
  fastify.register(userRouterAuth);
  fastify.register(featureRoutesAuth);
  fastify.register(utilitiesRoutesAuth);
  fastify.register(typesRoutesAuth);
  fastify.register(mapsRoutesAuth);

  fastify.addHook('onRequest', async (req: FastifyRequest, res: FastifyReply) => {
    const token = req.headers.authorization;
    if (token) {
      const decoded = await jwtService.verifyToken(token);
      if (decoded) {
        const userExists = await userServices.findOneUser(decoded.email);
        if (userExists) {
          req.user = decoded;
        } else {
          return res.send(CustomError('_', 'Usuário não encontrado!', 401));
        }
      } else {
        return res.send(CustomError('_', 'Token inválido!', 401));
      }
    } else {
      res.status(401);
      return res.send(ERR_NEED_LOGIN);
    }
  });
}
