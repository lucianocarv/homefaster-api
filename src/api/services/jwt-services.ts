import { fastify } from '../../index';
import { IJWTPayload } from '../interfaces/jwt-payload';

const jwtService = {
  createToken: async (payload: IJWTPayload) => {
    const token = fastify.jwt.sign(payload, { expiresIn: '1d' });
    return token;
  },

  verifyToken: async (token: string) => {
    const decoded = fastify.jwt.verify(token);
    return decoded as IJWTPayload;
  },
};

export { jwtService };
