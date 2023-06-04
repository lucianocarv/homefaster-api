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
  }
};

export { cityServices };
