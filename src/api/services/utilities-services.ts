import { Utility } from '@prisma/client';
import { prisma } from '../config/prisma-connect';
import { PaginationParameters } from '../interfaces/pagination-parameters';

const utilitiesServices = {
  getAllUtilities: async ({ page_number, per_page_number, skip }: PaginationParameters) => {
    const utilities = await prisma.utility.findMany({
      skip,
      take: per_page_number,
    });
    return { page: page_number, per_page: per_page_number, utilities };
  },

  findOne: async (name: string) => {
    const utility = await prisma.utility.findUnique({ where: { name } });
    return utility;
  },

  createOne: async (name: string) => {
    const utility = await prisma.utility.create({ data: { name } });
    return utility;
  },

  updateOneUtility: async (id: number, utility: Utility) => {
    const utilityUpdated = await prisma.utility.update({
      where: { id },
      data: utility,
    });

    return utilityUpdated;
  },

  deleteOne: async (id: number) => {
    const deleted = await prisma.utility.delete({ where: { id } });
    return deleted;
  },
};

export { utilitiesServices };
