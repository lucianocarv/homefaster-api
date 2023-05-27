import { Feature } from '@prisma/client';
import { prisma } from '../config/prisma/prisma.config';
import { PaginationParameters } from '../interfaces/pagination-parameters';

const featureServices = {
  findAllFeatures: async ({ page_number, per_page_number, skip }: PaginationParameters) => {
    const [features, count] = await Promise.all([
      prisma.feature.findMany({
        skip: skip,
        take: per_page_number,
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.feature.count()
    ]);

    const pages = Math.ceil(count / per_page_number);

    return {
      count,
      page: page_number,
      per_page: per_page_number,
      pages,
      features
    };
  },
  createFeature: async (feature: Feature) => {
    const newFeature = await prisma.feature.create({ data: feature });
    return newFeature;
  },

  findFeature: async (feature: Feature) => {
    const featureExists = await prisma.feature.findUnique({ where: { name: feature.name } });
    return featureExists;
  },

  updateOneFeature: async (id: number, feature: Feature) => {
    const featureUpdated = await prisma.feature.update({
      where: { id },
      data: feature
    });

    return featureUpdated;
  },

  deleteOneFeature: async (id: number) => {
    const featureDeleted = await prisma.feature.delete({ where: { id } });
    return featureDeleted;
  }
};

export { featureServices };
