import { prisma } from '../config/prisma-connect.js';
import { Province } from '@prisma/client';
import { PaginationParameters } from '../types/pagination-parameters.js';
import { IUpdateProperty } from '../interfaces/update-property.js';
import { UploadImageTo } from '../types/upload-image-to.js';
import { imageUpload } from '../storage/upload-image.js';
import { MultipartFile } from '@fastify/multipart';

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

  province: async (id: number) => {
    const province = await prisma.province.findUnique({ where: { id } });
    return province;
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

  uploadImgCover: async (data: MultipartFile, to: UploadImageTo, id: number) => {
    const filename = data.filename.replace(/\b(\s)\b/g, '-');
    const province = await prisma.province.findUnique({ where: { id: Number(id) } });
    if (province) {
      const res = await imageUpload({ to, file: data.file, filename, id });
      return res;
    } else {
      return { message: 'A provincia informada não existe!' };
    }
  },
};

export { provinceServices };
