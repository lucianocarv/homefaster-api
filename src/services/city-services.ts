import { prisma } from '../prisma-connect.js';
import { City } from '@prisma/client';
import { PaginationParameters } from '../types/pagination-parameters.js';

const citiesServices = {
  index: async ({ page_number, per_page_number, skip }: PaginationParameters): Promise<Object> => {
    const cities = await prisma.city.findMany({
      skip,
      take: per_page_number,
      include: {
        province: {
          select: {
            name: true,
          },
        },
      },
    });
    return { page: page_number, per_page: per_page_number, cities };
  },

  create: async (attributes: City): Promise<City> => {
    const city = await prisma.city.create({
      data: attributes,
      include: {
        province: {
          select: {
            name: true,
          },
        },
      },
    });
    return city;
  },

  update: async ({ id, attributes }: { id: number; attributes: City }): Promise<City> => {
    const city = await prisma.city.update({
      where: { id },
      data: attributes,
    });
    return city;
  },

  delete: async ({ id }: { id: number }): Promise<City> => {
    const city = await prisma.city.delete({
      where: { id },
    });
    return city;
  },
};

export { citiesServices };
