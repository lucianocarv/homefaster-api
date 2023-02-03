import { Community } from '@prisma/client';
import { prisma } from '../config/prisma-connect.js';
import { PaginationParameters } from '../types/pagination-parameters';

const communityServices = {
  index: async ({ page_number, per_page_number, skip }: PaginationParameters): Promise<Object> => {
    const communities = await prisma.community.findMany({
      take: per_page_number,
      skip,
    });
    return {
      page: page_number,
      per_page: per_page_number,
      communities,
    };
  },

  create: async (attributes: Community): Promise<Community> => {
    const community = await prisma.community.create({
      data: attributes,
    });
    return community;
  },

  update: async ({ id, attributes }: { id: number; attributes: Community }): Promise<Community> => {
    const community = await prisma.community.update({
      where: { id },
      data: attributes,
    });
    return community;
  },

  delete: async ({ id }: { id: number }): Promise<Community> => {
    const community = await prisma.community.delete({
      where: { id },
    });
    return community;
  },
};

export { communityServices };
