import { prisma } from '../../config/prisma/prisma.config';

const cityServices = {
  getFeaturedCities: async (q: number) => {
    try {
      const cities = await prisma.address.groupBy({
        orderBy: {
          _count: {
            city: 'desc'
          }
        },
        by: ['city', 'province'],
        _count: {
          city: true
        },
        take: typeof q == 'number' ? q : 5
      });
      return { cities };
    } catch (error) {
      return error;
    }
  },

  cityList: async (value: string) => {
    try {
      const cities = await prisma.address.groupBy({
        by: ['city', 'province'],
        where: {
          city: {
            contains: value
          }
        },
        orderBy: {
          city: 'desc'
        },

        take: 6
      });

      const modified = cities.map(c => `${c.city}, ${c.province}`);
      return modified;
    } catch (error) {
      return error;
    }
  }
};

export { cityServices };
