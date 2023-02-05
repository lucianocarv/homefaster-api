import { City, Community } from '@prisma/client';
import { prisma } from '../config/prisma-connect.js';
import { IReplyOfValidateAddressAPI, ValidateAddressAPI } from '../maps/validate-address-api.js';
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

  create: async (attributes: Community): Promise<Community | Error> => {
    const city = (await prisma.city.findUnique({
      where: { id: attributes.city_id },
      select: {
        name: true,
        province: true,
      },
    })) as { name: string; province: { name: string } } | null;

    if (!city) return new Error('Cannot find City');
    const validateAddres = (await ValidateAddressAPI.getDataForCommunity({
      province: city.province.name,
      city: city.name,
      community: attributes.name,
    })) as IReplyOfValidateAddressAPI;

    if (typeof validateAddres === 'object') {
      const { latitude, longitude, global_code, formatted_address } = validateAddres;
      const community = await prisma.community.create({
        data: { ...attributes, latitude, longitude, global_code, formatted_address },
      });
      return community;
    } else {
      return new Error('Invalid Community');
    }
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
