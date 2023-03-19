import { prisma } from '../../config/prisma-connect';
import bcrypt from 'bcrypt';

const seed = async () => {
  const passwordHash = await bcrypt.hash('123456789', 10);
  await prisma.$transaction([
    prisma.user.createMany({
      data: [
        {
          first_name: 'Luciano',
          last_name: 'Carvalho',
          email: 'lucianocarv13@gmail.com',
          avatar_url: 'null',
          password: passwordHash,
          role: 'Admin',
        },
        {
          first_name: 'Max',
          last_name: 'Andrews',
          email: 'max@gmail.com',
          avatar_url: 'null',
          password: passwordHash,
          role: 'Owner',
        },
      ],
    }),
  ]);
};

seed();
