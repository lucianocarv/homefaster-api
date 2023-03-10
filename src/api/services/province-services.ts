import { prisma } from '../config/prisma-connect.js';
import { Province } from '@prisma/client';
import { PaginationParameters } from '../types/pagination-parameters.js';
import { IUpdateProperty } from '../interfaces/update-property.js';

const provinceServices = {
  index: async ({ page_number, per_page_number, skip }: PaginationParameters): Promise<Object> => {
    const provinces = await prisma.province.findMany({
      take: per_page_number,
      skip,
    });
    return {
      page: page_number,
      per_page: per_page_number,
      provinces,
    };
  },

  create: async (attributes: Province): Promise<Province> => {
    const province = await prisma.province.create({
      data: attributes,
    });
    return province;
  },

  update: async ({ id, attibutes }: { id: number; attibutes: IUpdateProperty }): Promise<Province> => {
    const province = await prisma.province.update({
      where: {
        id,
      },
      data: attibutes,
    });
    return province;
  },

  delete: async ({ id }: { id: number }): Promise<Province> => {
    const province = await prisma.province.delete({
      where: { id },
    });
    return province;
  },
};

export { provinceServices };
