import { prisma } from '../../config/prisma-connect';

const seed = async () => {
  await prisma.$transaction([
    prisma.type.createMany({
      data: [
        {
          name: 'Apartment',
        },
        {
          name: 'House',
        },
      ],
    }),
  ]);
};

seed();
