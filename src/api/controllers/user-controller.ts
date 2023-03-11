import { User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IUserLogin } from '../interfaces/login-user';
import { userServices } from '../services/user-services';

const userController = {
  register: async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as User;
    try {
      const user = await userServices.register(data);
      return res.send(user);
    } catch (error) {
      return res.send(error);
    }
  },

  login: async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as IUserLogin;
    try {
      const user = await userServices.login(data);
      return res.send(user);
    } catch (error) {
      return res.send(error);
    }
  },
};

export { userController };
