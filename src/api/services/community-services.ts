import { MultipartFile } from '@fastify/multipart';
import { Community } from '@prisma/client';
import { prisma } from '../config/prisma-connect.js';
import { CustomError } from '../helpers/custom-error.js';
import { IUpdateCommunity } from '../interfaces/update-community.js';
import { IValidationAddressReply } from '../interfaces/validation-address-reply.js';
import { ValidateAddressAPI } from '../maps/validate-address-api.js';
import { imageUpload } from '../storage/upload-image.js';
import { PaginationParameters } from '../interfaces/pagination-parameters';
import { UploadImageTo } from '../types/upload-image-to.js';
import { ERR_COMMUNITY_ALREADY_EXISTS } from '../errors/index.js';
import storageServices from './storage-services.js';
import { getFileName } from '../helpers/get-filename.js';
import { env_storageBaseUrl } from '../../environment.js';

const communityServices = {
  getAllCommunities: async ({ page_number, per_page_number, skip }: PaginationParameters): Promise<Object> => {
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

  getOneCommunity: async (id: number) => {
    const community = await prisma.community.findUnique({ where: { id } });
    return community;
  },

  createOneCommunity: async (attributes: Community): Promise<Community | Error> => {
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
      const communityExists = await prisma.community.findUnique({ where: { global_code } });
      if (communityExists) throw ERR_COMMUNITY_ALREADY_EXISTS;
      const community = await prisma.community.create({
        data: { ...attributes, latitude, longitude, global_code, formatted_address },
      });
      return community;
    } else {
      return new Error('Invalid Community');
    }
  },

  updateOneCommunity: async ({ id, attributes }: { id: number; attributes: IUpdateCommunity }): Promise<Community> => {
    const community = await prisma.community.update({
      where: { id },
      data: attributes,
    });
    return community;
  },

  uploadCoverImage: async (data: MultipartFile, id: number) => {
    const filename = data.filename.replace(/\b(\s)\b/g, '-');
    const community = await prisma.community.findUnique({ where: { id } });
    if (community) {
      if (community) {
        if (community.img_cover) {
          const filePath = await getFileName(community.img_cover);
          storageServices.deleteFileInStorage(filePath);
        }
        const response = await storageServices.thumbImageUpload({ to: 'communities', file: data.file, filename, id });
        const newImageUrl = `${env_storageBaseUrl}/communities/${id}/${filename}`;
        await prisma.community.update({ where: { id }, data: { img_cover: newImageUrl } });
        return response;
      } else {
        return CustomError('_', 'Insira uma propriedade válida!', 400);
      }
    }
  },

  deleteOneCommunity: async ({ id }: { id: number }): Promise<Community> => {
    const community = await prisma.community.delete({
      where: { id },
    });
    return community;
  },
};

export { communityServices };
