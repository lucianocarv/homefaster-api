import { Role, User } from '@prisma/client';
import { prisma } from '../../config/prisma/prisma.config';
import bcrypt from 'bcrypt';
import { ILoginUser } from '../interfaces/login-user';
import { jwtService } from './jwt.services';
import { JWTUserPayload } from '../interfaces/jwt-payload';
import { PaginationParameters } from '../interfaces/pagination-parameters';
import { IUsersFilter } from '../interfaces/users-filter';

import {
  ERR_COULD_NOT_FIND_USER,
  ERR_EMAIL_ALREADY_USED,
  ERR_EMAIL_OR_PASSWORD_INCORRECT,
  ERR_FAIL_SET_NEW_PASS,
  ERR_INCORRECT_CURRENT_PASSWORD,
  ERR_NEED_REGISTER,
  ERR_NEW_PASS_DIFF_CURRENT,
  ERR_VERIFY_ACCOUNT
} from '../errors/user.errors';
import { ERR_LIMITED_PAGES } from '../errors/pagination.errors';

const userServices = {
  registerOneUser: async (data: User) => {
    const emailExists = await prisma.user.findUnique({ where: { email: data.email } });
    if (!emailExists) {
      const password = await bcrypt.hash(data.password, 10);
      const user = await prisma.user.create({
        data: {
          ...data,
          role: 'User',
          password
        }
      });
    } else {
      throw ERR_EMAIL_ALREADY_USED;
    }
  },

  registerOneUserAuth: async (data: User) => {
    const emailExists = await prisma.user.findUnique({ where: { email: data.email } });
    if (!emailExists) {
      const password = await bcrypt.hash(data.password, 10);
      const user = await prisma.user.create({
        data: {
          ...data,
          password
        }
      });
      return user;
    } else {
      throw ERR_EMAIL_ALREADY_USED;
    }
  },

  login: async (data: ILoginUser) => {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (user) {
      const validatePassword = await bcrypt.compare(data.password, user.password);
      if (validatePassword) {
        const { id, first_name, last_name, email, role } = user;
        const payload = { id, first_name, last_name, email, role } as JWTUserPayload;
        const token = await jwtService.createToken(payload);
        return { payload, token };
      } else {
        throw ERR_EMAIL_OR_PASSWORD_INCORRECT;
      }
    } else {
      throw ERR_NEED_REGISTER;
    }
  },

  verifyAccount: async (token: string, email: string) => {
    const decoded = await jwtService.verifyToken(token);
    if (decoded) {
      const user = await prisma.user.findUnique({
        where: {
          email: decoded.email
        }
      });
      if (user?.email == email) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            account_confirmed: true
          }
        });
        return { message: 'Conta verificada com sucesso!' };
      } else {
        throw ERR_VERIFY_ACCOUNT;
      }
    }
  },

  findOneUser: async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return user;
    } else {
      throw ERR_COULD_NOT_FIND_USER;
    }
  },

  findUserById: async (id: number) => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        first_name: true,
        last_name: true,
        phone: true,
        role: true
      }
    });
    if (user) {
      return user;
    } else {
      throw ERR_COULD_NOT_FIND_USER;
    }
  },

  findAllUsers: async (pagination: PaginationParameters, filter: IUsersFilter) => {
    const [users, count] = await Promise.all([
      prisma.user.findMany({
        take: pagination.per_page_number,
        skip: pagination.skip,
        where: {
          first_name: { contains: filter?.first_name },
          last_name: { contains: filter?.last_name },
          email: { contains: filter?.email }
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          role: true,
          account_confirmed: true
        }
      }),
      prisma.user.count({
        where: {
          first_name: { contains: filter?.first_name },
          last_name: { contains: filter?.last_name },
          email: { contains: filter?.email }
        }
      })
    ]);
    const pages = Math.ceil(count / pagination.per_page_number);
    if (pagination.page_number > pages) throw ERR_LIMITED_PAGES;
    return { count, page: pagination.page_number, per_page: pagination.per_page_number, pages, users };
  },

  updateUser: async (id: number, attributes: User) => {
    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        first_name: attributes.first_name,
        last_name: attributes.last_name,
        phone: attributes.phone
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true
      }
    });

    return user;
  },

  updateUserAsAdmin: async (id: number, role: Role) => {
    const user = await prisma.user.update({
      where: { id },
      data: {
        role: role
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        role: true
      }
    });
    return user;
  },

  updatePassword: async (id: number, attributes: { current_password: string; new_password: string }) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      const checkPassword = await bcrypt.compare(attributes.current_password, user.password);
      if (checkPassword) {
        const newPasswordHash = await bcrypt.hash(attributes.new_password, 10);
        const equal = await bcrypt.compare(attributes.current_password, newPasswordHash);
        if (!equal) {
          if (newPasswordHash) {
            await prisma.user.update({
              where: { id },
              data: { password: newPasswordHash }
            });
            return true;
          } else {
            throw ERR_FAIL_SET_NEW_PASS;
          }
        } else {
          throw ERR_NEW_PASS_DIFF_CURRENT;
        }
      } else {
        throw ERR_INCORRECT_CURRENT_PASSWORD;
      }
    } else {
      throw ERR_COULD_NOT_FIND_USER;
    }
  },

  updatePasswordAsAdmin: async (attributes: { email: string; new_password: string }) => {
    const user = await prisma.user.findUnique({ where: { email: attributes.email } });
    if (user) {
      const newPasswordHash = await bcrypt.hash(attributes.new_password, 10);
      if (newPasswordHash) {
        await prisma.user.update({
          where: { email: attributes.email },
          data: { password: newPasswordHash }
        });
        return true;
      } else {
        throw ERR_FAIL_SET_NEW_PASS;
      }
    } else {
      throw ERR_COULD_NOT_FIND_USER;
    }
  },

  deleteOneUser: async (id: number) => {
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (userExists) {
      await prisma.user.delete({ where: { id } });
      return { message: 'Usuário excluído com sucesso!' };
    } else {
      throw ERR_COULD_NOT_FIND_USER;
    }
  }
};

export { userServices };
