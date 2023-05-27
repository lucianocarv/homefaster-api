import { fastify } from '../../app';
import { IConfirmAccountPayload } from '../interfaces/confirm-account-payload';
import { JWTUserPayload } from '../interfaces/jwt-payload';

const jwtService = {
  createToken: async (payload: JWTUserPayload) => {
    const token = fastify.jwt.sign(payload, { expiresIn: '1d' });
    return token;
  },

  verifyToken: async (token: string) => {
    const decoded = fastify.jwt.verify(token);
    return decoded as JWTUserPayload;
  },

  createTokenToConfirmAccount: async (payload: IConfirmAccountPayload) => {
    const token = fastify.jwt.sign(payload, { expiresIn: '3m' });
    return token;
  }
};

export { jwtService };
