import { prisma } from '../config/prisma-connect.js';

async function seed() {
  await prisma.$transaction([
    prisma.manager.createMany({
      data: [
        {
          id: 1,
          name: 'Luciano Carvalho',
          type: 'Private',
          email: 'lucianocarv13@rents.ca',
          phone: '47996107008',
          website: 'https://www.luciano-rentals.ca',
        },
        {
          id: 2,
          name: 'Calgary Rentals',
          type: 'Private',
          email: 'calgaryrentals@calgaryrentals.ca',
          phone: '1937289301',
          website: 'https://www.google.ca',
        },
      ],
    }),
    prisma.propertyType.createMany({
      data: [
        {
          id: 1,
          name: 'Apartment',
        },
        {
          id: 2,
          name: 'House',
        },
      ],
    }),
    prisma.province.createMany({
      data: [
        {
          id: 1,
          name: 'Alberta',
          short_name: 'AB',
          global_code: 'XPTO1',
        },
        {
          id: 2,
          name: 'British Columbia',
          short_name: 'BC',
          global_code: 'XPTO2',
        },
      ],
    }),

    prisma.city.createMany({
      data: [
        {
          id: 1,
          name: 'Calgary',
          global_code: 'XPTO11',
          province_id: 1,
        },
        {
          id: 2,
          name: 'Vancouver',
          global_code: 'XPTO21',
          province_id: 2,
        },
      ],
    }),

    prisma.community.createMany({
      data: [
        {
          id: 1,
          name: 'Somerset',
          global_code: 'XPTO111',
          city_id: 1,
        },
        {
          id: 2,
          name: 'Lake Bonavista',
          global_code: 'XPTO112',
          city_id: 1,
        },
        {
          id: 3,
          name: 'Oakland',
          global_code: 'XPTO211',
          city_id: 2,
        },
        {
          id: 4,
          name: 'Dickens',
          global_code: 'XPTO212',
          city_id: 2,
        },
        {
          id: 5,
          name: 'Strathcona',
          global_code: 'XPTO213',
          city_id: 2,
        },
      ],
    }),

    prisma.utility.createMany({
      data: [
        {
          id: 1,
          name: 'Heat',
        },
        {
          id: 2,
          name: 'Water',
        },
        {
          id: 3,
          name: 'Internet',
        },
      ],
    }),
    prisma.feature.createMany({
      data: [
        {
          id: 1,
          type: 'Property',
          name: 'Air Conditioning',
        },
        {
          id: 2,
          type: 'Property',
          name: 'Balcony',
        },
        {
          id: 3,
          type: 'Property',
          name: 'Dishwasher',
        },
        {
          id: 4,
          type: 'Building',
          name: 'Elevator',
        },
        {
          id: 5,
          type: 'Building',
          name: 'Fitness Area',
        },
        {
          id: 6,
          type: 'Building',
          name: 'Secure Entry',
        },
        {
          id: 7,
          type: 'Community',
          name: 'Bus',
        },
        {
          id: 8,
          type: 'Community',
          name: 'Pool',
        },
        {
          id: 9,
          type: 'Community',
          name: 'River',
        },
      ],
    }),
  ]);
}

seed();
