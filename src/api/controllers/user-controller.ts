import { User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IUserLogin } from '../interfaces/login-user';
import { userServices } from '../services/user-services';

const userController = {
  register: async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as User;
    try {
      const user = await userServices.register(data);
      res.send(user);
    } catch (error) {
      res.send(error);
    }
  },

  login: async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as IUserLogin;
    try {
      const user = await userServices.login(data);
      res.send(user);
    } catch (error) {
      res.send(error);
    }
  },
};

export { userController };
