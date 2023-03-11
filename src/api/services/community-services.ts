import { MultipartFile } from '@fastify/multipart';
import { City, Community } from '@prisma/client';
import { prisma } from '../config/prisma-connect.js';
import { CustomError } from '../helpers/custom-error.js';
import { IUpdateCommunity } from '../interfaces/update-community.js';
import { IValidationAddressReply } from '../interfaces/validation-address-reply.js';
import { ValidateAddressAPI } from '../maps/validate-address-api.js';
import { imageUpload } from '../storage/upload-image.js';
import { PaginationParameters } from '../types/pagination-parameters';
import { UploadImageTo } from '../types/upload-image-to.js';

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

  community: async (id: number) => {
    const community = await prisma.community.findUnique({ where: { id } });
    return community;
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
    })) as IValidationAddressReply;

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

  update: async ({ id, attributes }: { id: number; attributes: IUpdateCommunity }): Promise<Community> => {
    const community = await prisma.community.update({
      where: { id },
      data: attributes,
    });
    return community;
  },

  uploadCoverImage: async (data: MultipartFile, to: UploadImageTo, id: number) => {
    const filename = data.filename.replace(/\b(\s)\b/g, '-');
    const property = await prisma.community.findUnique({ where: { id: Number(id) } });
    if (property) {
      const res = await imageUpload({ to, file: data.file, filename, id });
      return res;
    } else {
      return CustomError('_', 'Insira uma propriedade válida!', 400);
    }
  },

  delete: async ({ id }: { id: number }): Promise<Community> => {
    const community = await prisma.community.delete({
      where: { id },
    });
    return community;
  },
};

export { communityServices };
