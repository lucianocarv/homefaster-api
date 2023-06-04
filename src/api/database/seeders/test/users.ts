import { TEST_EMAIL, TEST_PASSWORD } from '../../../../config/environment';
import { prisma } from '../../../../config/prisma/prisma.config';
import bcrypt from 'bcrypt';

const seed = async () => {
  const passwordHash = await bcrypt.hash(String(TEST_PASSWORD), 10);
  await prisma.$transaction([
    prisma.user.createMany({
      data: [
        {
          first_name: 'Luciano',
          last_name: 'Carvalho',
          email: String(TEST_EMAIL),
          password: passwordHash,
          role: 'Admin'
        }
      ]
    })
  ]);
};

seed();
