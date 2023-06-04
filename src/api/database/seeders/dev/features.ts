import { prisma } from '../../../../config/prisma/prisma.config';

const seed = async () => {
  await prisma.$transaction([
    prisma.feature.createMany({
      data: [
        {
          name: 'Air Conditioning',
          type: 'Property'
        },
        {
          name: 'Fridge',
          type: 'Property'
        },
        {
          name: 'Microwave',
          type: 'Property'
        },
        {
          name: 'Elevator',
          type: 'Building'
        },
        {
          name: 'Secure Entry',
          type: 'Building'
        },
        {
          name: 'Fitness Area',
          type: 'Building'
        },
        {
          name: 'Shopping Center',
          type: 'Community'
        },
        {
          name: 'Bus',
          type: 'Community'
        },
        {
          name: 'River',
          type: 'Community'
        }
      ]
    })
  ]);
};

seed();
