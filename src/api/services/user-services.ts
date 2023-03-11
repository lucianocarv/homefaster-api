import { User } from '@prisma/client';
import { prisma } from '../config/prisma-connect';
import bcrypt from 'bcrypt';
import { IUserLogin } from '../interfaces/login-user';
import { jwtService } from './jwt-services';
import { IJWTPayload } from '../interfaces/jwt-payload';

const userServices = {
  registerOneUser: async (data: User) => {
    const emailExists = await prisma.user.findUnique({ where: { email: data.email } });
    if (!emailExists) {
      const password = await bcrypt.hash(data.password, 10);
      const user = await prisma.user.create({
        data: {
          ...data,
          password,
        },
      });
      return user;
    } else {
      throw { code: '_', message: 'Este email já está sendo usado!', statusCode: 422 };
    }
  },

  login: async (data: IUserLogin) => {
    const user = await userServices.findOneUser(data.email);
    if (user) {
      const validatePassword = await bcrypt.compare(data.password, user.password);
      if (validatePassword) {
        const { id, first_name, last_name, email, role } = user;
        const payload = { id, first_name, last_name, email, role } as IJWTPayload;
        const token = await jwtService.createToken(payload);
        return { payload, token };
      } else {
        throw { code: '_', message: 'Senha ou email incorretos!', statusCode: 401 };
      }
    } else {
      throw { code: '_', message: 'Cadastre-se para fazer login!', statusCode: 422 };
    }
  },

  findOneUser: async (email: string) => {
    const user = await prisma.user.findFirst({ where: { email } });
    return user;
  },
};

export { userServices };
