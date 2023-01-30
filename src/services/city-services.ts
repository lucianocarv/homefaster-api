import { getPagination } from '../helpers/get-pagination.js';
import { prisma } from '../prisma-connect.js';
import { City } from '../types/city.js';

const citiesServices = {
  index: async (page: string, perPage: string) => {
    const [pageNumber, perPageNumber, skip] = getPagination(page, perPage);

    const cities = await prisma.city.findMany({
      orderBy: {
        id: 'asc',
      },
      skip,
      take: perPageNumber,
      include: {
        province: {
          select: {
            name: true,
          },
        },
      },
    });
    return { page: pageNumber, perPage: perPageNumber, cities };
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
};

export { citiesServices };
