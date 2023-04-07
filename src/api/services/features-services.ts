import { Feature } from '@prisma/client';
import { prisma } from '../config/prisma-connect';
import { PaginationParameters } from '../interfaces/pagination-parameters';

const featureServices = {
  createFeature: async (feature: Feature) => {
    const newFeature = prisma.feature.create({ data: feature });
    return newFeature;
  },

  findFeature: async (feature: Feature) => {
    const featureExists = await prisma.feature.findUnique({ where: { name: feature.name } });
    return featureExists;
  },

  findAllFeatures: async ({ page_number, per_page_number, skip }: PaginationParameters) => {
    const features = await prisma.feature.findMany({
      skip: skip,
      take: per_page_number,
      orderBy: {
        name: 'asc',
      },
    });
    return {
      page: page_number,
      per_page: per_page_number,
      features,
    };
  },

  deleteFeature: async (feature: Feature) => {
    const featureDeleted = await prisma.feature.delete({ where: { id: feature.id } });
    return featureDeleted;
  },
};

export { featureServices };
