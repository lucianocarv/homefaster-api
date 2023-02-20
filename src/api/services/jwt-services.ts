import { server } from '../../index';
import { IJWTPayload } from '../interfaces/jwt-payload';

const jwtService = {
  createToken: async (payload: IJWTPayload) => {
    const token = server.jwt.sign(payload);
    return token;
  },

  verifyToken: async (token: string) => {
    const decoded = server.jwt.verify(token);
    return decoded as IJWTPayload;
  },
};

export { jwtService };
