import { Role, User } from '@prisma/client';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error';
import { getPagination } from '../helpers/get-pagination';
import { ICustomError } from '../interfaces/custom-error';
import { ILoginUser } from '../interfaces/login-user';
import { PaginationParameters } from '../interfaces/pagination-parameters';
import { IUsersFilter } from '../interfaces/users-filter';
import { userServices } from '../services/user-services';
import { ERR_USERS_INVALID_ROLE, ERR_USERS_USER_CREATE_PERMISSION_DENIED } from '../errors/user-errors';
import { ERR_PERMISSION_DENIED } from '../errors/permission-erros';
import { UserModel } from '../../../prisma/models';
import { getIssuesZod } from '../helpers/get-issues-zod';

const userController = {
  register: async (req: FastifyRequest, res: FastifyReply): Promise<User | FastifyError> => {
    const parse = UserModel.partial({ account_confirmed: true, id: true, phone: true, role: true }).safeParse(req.body);
    if (!parse.success) {
      const messages = getIssuesZod(parse.error.issues);
      throw CustomError('_', messages.toString(), 400);
    }
    const data = req.body as User;

    try {
      const user = await userServices.registerOneUser(data);
      return res.status(201).send(user);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  registerAuth: async (req: FastifyRequest, res: FastifyReply): Promise<User | FastifyError> => {
    const user = req.user as User;
    if (!user) throw ERR_PERMISSION_DENIED;
    const data = req.body as User;
    if (!['User', 'Admin', 'Manager'].includes(data.role)) throw ERR_USERS_INVALID_ROLE;
    if (data.role == 'Admin' && user.role == 'User') throw ERR_USERS_USER_CREATE_PERMISSION_DENIED;
    try {
      const user = await userServices.registerOneUserAuth(data);
      return res.status(201).send(user);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  login: async (req: FastifyRequest, res: FastifyReply): Promise<object | FastifyError> => {
    const data = req.body as ILoginUser;
    try {
      const user = await userServices.login(data);
      return res.status(202).send(user);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  confirmAccount: async (req: FastifyRequest, res: FastifyReply) => {
    const { token } = req.body as { token: string };
    const user = req.user as User;
    try {
      const response = await userServices.verifyAccount(token, user.email);
      res.send(response);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  updateOneUser: async (req: FastifyRequest, res: FastifyReply): Promise<object | FastifyError> => {
    const attributes = req.body as User;
    const user = req.user as User;
    if (!user) throw ERR_PERMISSION_DENIED;
    try {
      const userUpdated = await userServices.updateOneUser(user.id, attributes);
      return res.status(202).send(userUpdated);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  updateUserAsAdmin: async (req: FastifyRequest, res: FastifyReply): Promise<User | FastifyError> => {
    const admin = req.user as User;
    if (admin.role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const { id } = req.params as { id: string };
    const { role } = req.body as { role: Role };
    if (!['Admin', 'Manager', 'User'].includes(role)) throw ERR_USERS_INVALID_ROLE;
    try {
      const user = await userServices.updateUserAsAdmin(Number(id), role);
      return res.status(202).send(user);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  updatePassword: async (req: FastifyRequest, res: FastifyReply): Promise<object | FastifyError> => {
    const user = req.user as User;
    if (!user) throw ERR_PERMISSION_DENIED;
    const attributes = req.body as { current_password: string; new_password: string };
    try {
      const result = await userServices.updatePassword(user.id, attributes);
      return res.status(202).send(result);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  updatePasswordAsAdmin: async (req: FastifyRequest, res: FastifyReply): Promise<object | FastifyError> => {
    const admin = req.user as User;
    if (admin.role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const attributes = req.body as { email: string; new_password: string };
    try {
      const result = await userServices.updatePasswordAsAdmin(attributes);
      return res.status(202).send(result);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  getOneUser: async (req: FastifyRequest, res: FastifyReply): Promise<User | FastifyError> => {
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
  getAllUsers: async (req: FastifyRequest, res: FastifyReply) => {
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

  deleteOneUser: async (req: FastifyRequest, res: FastifyReply) => {
    const admin = req.user as User;
    if (admin.role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const { id } = req.params as { id: string };
    try {
      const result = await userServices.deleteOneUser(Number(id));
      return res.status(202).send(result);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  }
};

export { userController };
