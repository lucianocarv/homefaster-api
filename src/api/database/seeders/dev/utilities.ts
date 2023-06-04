import { prisma } from '../../../../config/prisma/prisma.config';

const seed = async () => {
  await prisma.$transaction([
    prisma.utility.createMany({
      data: [
        {
          name: 'Heat'
        },
        {
          name: 'Water'
        },
        {
          name: 'Internet'
        },
        {
          name: 'Electricity'
        },
        {
          name: 'Cable'
        }
      ]
    })
  ]);
};

seed();
