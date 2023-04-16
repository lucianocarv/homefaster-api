import { prisma } from '../config/prisma-connect.js';
import { Province } from '@prisma/client';
import { PaginationParameters } from '../interfaces/pagination-parameters.js';
import { IUpdateProperty } from '../interfaces/update-property.js';
import { MultipartFile } from '@fastify/multipart';
import { ERR_PROVINCE_ALREADY_EXISTS, ERR_PROVINCE_NOT_FOUND } from '../errors/province-errors';
import storageServices from './storage-services.js';
import { getFileName } from '../helpers/get-filename';
import { env_storageBaseUrl } from '../../environment.js';

const provinceServices = {
  getAllProvinces: async ({ page_number, per_page_number, skip }: PaginationParameters): Promise<object> => {
    const [provinces, count] = await Promise.all([
      prisma.province.findMany({
        take: per_page_number,
        skip
      }),
      prisma.province.count()
    ]);

    const pages = Math.ceil(count / per_page_number);

    return {
      count,
      page: page_number,
      pages,
      per_page: per_page_number,
      provinces
    };
  },

  getOneProvince: async (id: number) => {
    const province = await prisma.province.findUnique({ where: { id } });
    return province;
  },

  createOneProvince: async (attributes: Province): Promise<Province> => {
    const [provinceExistsShortName, provinceExistsName] = await Promise.all([
      prisma.province.findUnique({
        where: { short_name: attributes.short_name }
      }),
      prisma.province.findUnique({
        where: { name: attributes.name }
      })
    ]);
    if (!provinceExistsName && !provinceExistsShortName) {
      const province = await prisma.province.create({
        data: attributes
      });
      return province;
    } else {
      throw ERR_PROVINCE_ALREADY_EXISTS;
    }
  },

  updateOneProvince: async ({ id, attibutes }: { id: number; attibutes: IUpdateProperty }): Promise<Province> => {
    const province = await prisma.province.update({
      where: {
        id
      },
      data: attibutes
    });
    return province;
  },

  deleteOneProvince: async ({ id }: { id: number }): Promise<Province> => {
    const province = await prisma.province.delete({
      where: { id }
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
  }
};

export { provinceServices };
