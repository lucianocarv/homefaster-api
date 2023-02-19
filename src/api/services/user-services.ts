import { User } from '@prisma/client';
import { prisma } from '../config/prisma-connect';
import bcrypt from 'bcrypt';
import { IUserLogin } from '../interfaces/login-user';
import { jwtService } from './jwt-services';
import { IJWTPayload } from '../interfaces/jwt-payload';

const userServices = {
  register: async (data: User) => {
    const password = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        ...data,
        password,
      },
    });
    return user;
  },

  login: async (data: IUserLogin) => {
    const user = await userServices.findUser(data.email);
    if (user) {
      const validatePassword = await bcrypt.compare(data.password, user.password);
      if (validatePassword) {
        const { id, first_name, last_name, email, role } = user;
        const payload = { id, first_name, last_name, email, role } as IJWTPayload;
        const token = await jwtService.createToken(payload);
        return { payload, token };
      }
    } else {
      return 'Usuario nao cadastrado!';
    }
  },

  findUser: async (email: string) => {
    const user = await prisma.user.findFirst({ where: { email } });
    return user;
  },
};

export { userServices };
