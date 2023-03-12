import { User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error';
import { ICustomError } from '../interfaces/custom-error';
import { IUserLogin } from '../interfaces/login-user';
import { userServices } from '../services/user-services';

const userController = {
  register: async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as User;
    try {
      const user = await userServices.registerOneUser(data);
      return res.send(user);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  registerAuth: async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user as User;
    const data = req.body as User;
    if ((data.role == 'Admin' && user.role == 'Manager') || user.role == 'User')
      throw { code: '_', message: 'Você não tem permissão para criar um usuário administrador!', statusCode: 401 };
    if (data.role !== ('Admin' || 'Manager' || 'User'))
      throw { code: '_', message: 'Insira uma função válida para o usuário!', statusCode: 422 };
    try {
      const user = await userServices.registerOneUserAuth(data);
      return res.send(user);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  login: async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as IUserLogin;
    try {
      const user = await userServices.login(data);
      return res.send(user);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },
};

export { userController };
