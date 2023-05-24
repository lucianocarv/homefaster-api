import { env_test_email, env_test_password } from '../../../../environment';
import { prisma } from '../../../config/prisma/prisma-connect';
import bcrypt from 'bcrypt';

const seed = async () => {
  const passwordHash = await bcrypt.hash(String(env_test_password), 10);
  await prisma.$transaction([
    prisma.user.createMany({
      data: [
        {
          first_name: 'Luciano',
          last_name: 'Carvalho',
          email: String(env_test_email),
          password: passwordHash,
          role: 'Admin'
        }
      ]
    })
  ]);
};

seed();
