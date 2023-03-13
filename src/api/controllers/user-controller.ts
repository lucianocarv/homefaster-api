import { User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error';
import { getPagination } from '../helpers/get-pagination';
import { ICustomError } from '../interfaces/custom-error';
import { IUserLogin } from '../interfaces/login-user';
import { PaginationParameters } from '../interfaces/pagination-parameters';
import { IUsersFilter } from '../interfaces/users-filter';
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
    if (!['User', 'Admin', 'Manager'].includes(data.role))
      throw { code: '_', message: 'Insira uma função válida para o usuário!', statusCode: 422 };
    if ((data.role == 'Admin' && user.role == 'Manager') || user.role == 'User')
      throw { code: '_', message: 'Você não tem permissão para criar este tipo de usuário!', statusCode: 401 };
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

  update: async (req: FastifyRequest, res: FastifyReply) => {
    const attributes = req.body as User;
    const user = req.user as User;
    try {
      const userUpdated = await userServices.updateOneUser(user.id, attributes);
      return res.send(userUpdated);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  user: async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    try {
      const user = await userServices.findUserById(Number(id));
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
  users: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    const body = req.body as { filter: IUsersFilter };
    const filter = body?.filter;
    try {
      const users = await userServices.findAllUsers({ page_number, per_page_number, skip }, filter);
      return res.send(users);
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
