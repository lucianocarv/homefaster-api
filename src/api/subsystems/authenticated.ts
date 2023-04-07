import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import middie from '@fastify/middie';
import { jwtService } from '../../api/services/jwt-services';
import { userServices } from '../../api/services/user-services';
import { favoritesRouter } from '../../api/routes/favorites-router';
import { cityRoutesAuth } from '../../api/routes/city-router-auth';
import { CustomError } from '../../api/helpers/custom-error';
import { provinceRoutesAuth } from '../../api/routes/province-router-auth';
import { communityRoutesAuth } from '../../api/routes/community-router-auth';
import { propertyRoutesAuth } from '../../api/routes/property-router-auth';
import { userRouterAuth } from '../../api/routes/user-router-auth';
import { ERR_NEED_LOGIN } from '../../api/errors/permission-erros';
import { featureRoutesAuth } from '../routes/feature-router-auth';
import { utilitiesRoutesAuth } from '../routes/utilities-router-auth';

export async function authenticatedSystem(fastify: FastifyInstance) {
  fastify.register(middie, { hook: 'onRequest' });
  // Routes
  fastify.register(favoritesRouter);
  fastify.register(provinceRoutesAuth);
  fastify.register(cityRoutesAuth);
  fastify.register(communityRoutesAuth);
  fastify.register(propertyRoutesAuth);
  fastify.register(userRouterAuth);
  fastify.register(featureRoutesAuth);
  fastify.register(utilitiesRoutesAuth);

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
