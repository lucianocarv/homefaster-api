import { prisma } from '../config/prisma-connect.js';
import { Province } from '@prisma/client';
import { PaginationParameters } from '../interfaces/pagination-parameters.js';
import { IUpdateProperty } from '../interfaces/update-property.js';
import { MultipartFile } from '@fastify/multipart';
import { ERR_PROVINCE_NOT_FOUND } from '../errors/province-errors';
import storageServices from './storage-services.js';
import { getFileName } from '../helpers/get-filename';
import { env_storageBaseUrl } from '../../environment.js';

const provinceServices = {
  getAllProvinces: async ({ page_number, per_page_number, skip }: PaginationParameters): Promise<Object> => {
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

  getOneProvince: async (id: number) => {
    const province = await prisma.province.findUnique({ where: { id } });
    return province;
  },

  createOneProvince: async (attributes: Province): Promise<Province> => {
    const province = await prisma.province.create({
      data: attributes,
    });
    return province;
  },

  updateOneProvince: async ({ id, attibutes }: { id: number; attibutes: IUpdateProperty }): Promise<Province> => {
    const province = await prisma.province.update({
      where: {
        id,
      },
      data: attibutes,
    });
    return province;
  },

  deleteOneProvince: async ({ id }: { id: number }): Promise<Province> => {
    const province = await prisma.province.delete({
      where: { id },
    });
    return province;
  },

  uploadImgCover: async (data: MultipartFile, id: number) => {
    const filename = data.filename.replace(/\b(\s)\b/g, '-');
    const province = await prisma.province.findUnique({ where: { id: Number(id) } });
    if (province) {
      if (province.img_cover) {
        const filePath = await getFileName(province.img_cover);
        storageServices.deleteFileInStorage(filePath);
      }
      const response = await storageServices.thumbImageUpload({ to: 'provinces', file: data.file, filename, id });
      const newImageUrl = `${env_storageBaseUrl}/provinces/${id}/${filename}`;
      await prisma.province.update({ where: { id }, data: { img_cover: newImageUrl } });
      return response;
    } else {
      throw ERR_PROVINCE_NOT_FOUND;
    }
  },
};

export { provinceServices };
