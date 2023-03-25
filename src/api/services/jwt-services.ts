import { fastify } from '../../index';
import { IConfirmAccountPayload } from '../interfaces/confirm-account-payload';
import { IUserPayload } from '../interfaces/jwt-payload';

const jwtService = {
  createToken: async (payload: IUserPayload) => {
    const token = fastify.jwt.sign(payload, { expiresIn: '1d' });
    return token;
  },

  verifyToken: async (token: string) => {
    const decoded = fastify.jwt.verify(token);
    return decoded as IUserPayload;
  },

  createTokenToConfirmAccount: async (payload: IConfirmAccountPayload) => {
    const token = fastify.jwt.sign(payload, { expiresIn: '1m' });
    return token;
  },
};

export { jwtService };
