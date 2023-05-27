import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import middie from '@fastify/middie';
import { jwtService } from '../../services/jwt.services';
import { userServices } from '../../services/user.services';
import { favoritesRouter } from '../../routes/favorites.routes';
import { CustomError } from '../../../api/helpers/custom-error';
import { propertyRoutesAuth } from '../../routes/property.auth.routes';
import { userRouterAuth } from '../../routes/user.auth.routes';
import { ERR_NEED_LOGIN } from '../../../api/errors/permission-erros';
import { featureRoutesAuth } from '../../routes/feature.auth.routes';
import { utilitiesRoutesAuth } from '../../routes/utilities.auth.routes';
import { typesRoutesAuth } from '../../routes/types.auth.routes';
import { mapsRoutesAuth } from '../../routes/maps.auth.routes';

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
