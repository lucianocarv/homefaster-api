import { prisma } from '../../config/prisma-connect';

const seed = async () => {
  await prisma.$transaction([
    prisma.manager.createMany({
      data: [
        {
          name: 'Edmonton Rentals CA',
          email: 'erc@edmontonrentals.ca',
          phone: '555-555',
          website: 'https://www.ed.rentals.ca',
        },
        {
          name: 'Calgary Rentals CA',
          email: 'crc@edmontonrentals.ca',
          phone: '555-555',
          website: 'https://www.ca.rentals.ca',
        },
      ],
    }),
  ]);
};

seed();
