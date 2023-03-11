import { prisma } from '../config/prisma-connect.js';
import { City, Province } from '@prisma/client';
import { PaginationParameters } from '../types/pagination-parameters.js';
import { GeocodingAPI } from '../maps/geocode-api.js';
import { IUpdateCity } from '../interfaces/update-city.js';
import { MultipartFile } from '@fastify/multipart';
import { UploadImageTo } from '../types/upload-image-to.js';
import { imageUpload } from '../storage/upload-image.js';

const citiesServices = {
  getAllCities: async ({ page_number, per_page_number, skip }: PaginationParameters): Promise<Object> => {
    const cities = await prisma.city.findMany({
      skip,
      take: per_page_number,
      include: {
        province: {
          select: {
            name: true,
          },
        },
      },
    });
    const count = cities.length;
    return { count, page: page_number, per_page: per_page_number, cities };
  },

  getOneCity: async (id: number) => {
    const city = await prisma.city.findUnique({ where: { id } });

    if (city) {
      return city;
    } else {
      throw { code: '_', message: 'Esta cidade não existe', statusCode: 400 };
    }
  },

  createOneCity: async (attributes: City): Promise<City | Error> => {
    const { short_name } = (await prisma.province.findUnique({ where: { id: attributes.province_id } })) as Province;
    const geocode = await GeocodingAPI.getDataForCity(short_name, attributes.name);
    if (typeof geocode === 'object') {
      const { latitude, longitude, place_id } = geocode;
      const city = await prisma.city.create({
        data: { ...attributes, latitude, longitude, place_id },
      });
      return city;
    } else {
      throw { code: '_', message: 'Informe uma cidade válida!', statusCode: 422 };
    }
  },

  updateOneCity: async ({ id, attributes }: { id: number; attributes: IUpdateCity }): Promise<City> => {
    const city = await prisma.city.update({
      where: { id },
      data: attributes,
    });
    return city;
  },

  uploadCoverImage: async (data: MultipartFile, to: UploadImageTo, id: number) => {
    const filename = data.filename.replace(/\b(\s)\b/g, '-');
    const property = await prisma.city.findUnique({ where: { id: Number(id) } });
    if (property) {
      const res = await imageUpload({ to, file: data.file, filename, id });
      return res;
    } else {
      throw { code: '_', message: 'Insira uma cidade válida!', statusCode: 422 };
    }
  },

  deleteOneCity: async ({ id }: { id: number }) => {
    const city = await prisma.city.findUnique({ where: { id } });
    if (city) {
      return await prisma.city
        .delete({
          where: { id },
        })
        .then(() => {
          return { message: 'Cidade excluída com sucesso!' };
        });
    } else {
      throw { code: '_', message: 'Cidade não encontrada!', statusCode: 400 };
    }
  },
};

export { citiesServices };
