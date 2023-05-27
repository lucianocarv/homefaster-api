import { Type } from '@prisma/client';
import { prisma } from '../config/prisma/prisma.config';
import { PaginationParameters } from '../interfaces/pagination-parameters';

const typeServices = {
  getAllTypes: async ({ page_number, per_page_number, skip }: PaginationParameters) => {
    const [types, count] = await Promise.all([
      prisma.type.findMany({
        skip,
        take: per_page_number
      }),
      prisma.type.count()
    ]);

    const pages = Math.ceil(count / per_page_number);

    return {
      count,
      page: page_number,
      pages,
      per_page: per_page_number,
      types
    };
  },

  getOneTypeById: async (id: number) => {
    const type = await prisma.type.findUnique({ where: { id } });
    return type;
  },

  getOneTypeByName: async (name: string) => {
    const type = await prisma.type.findUnique({ where: { name } });
    return type;
  },
  addType: async (data: Type) => {
    const type = await prisma.type.create({ data });
    return type;
  },

  removeType: async (id: number) => {
    const type = await prisma.type.delete({ where: { id } });
    return type;
  }
};

export { typeServices };
