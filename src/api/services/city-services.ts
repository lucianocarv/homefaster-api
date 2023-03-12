import { prisma } from '../config/prisma-connect.js';
import { City } from '@prisma/client';
import { PaginationParameters } from '../interfaces/pagination-parameters.js';
import { GeocodingAPI } from '../maps/geocode-api.js';
import { IUpdateCity } from '../interfaces/update-city.js';
import { MultipartFile } from '@fastify/multipart';
import { UploadImageTo } from '../types/upload-image-to.js';
import { imageUpload } from '../storage/upload-image.js';

const citiesServices = {
  getAllCities: async ({ page_number, per_page_number, skip }: PaginationParameters): Promise<Object> => {
    const [cities, count] = await Promise.all([
      prisma.city.findMany({
        skip,
        take: per_page_number,
        include: {
          province: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.city.count(),
    ]);
    const pages = Math.ceil(count / per_page_number);
    return { count, page: page_number, per_page: per_page_number, pages, cities };
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
    const province = await prisma.province.findUnique({ where: { id: attributes.province_id } });
    if (!province) throw { code: '_', message: 'Província inválida!', statusCode: 422 };

    const geocodingData = await GeocodingAPI.getDataForCity(province.short_name, attributes.name);

    if (typeof geocodingData === 'object') {
      const { name, latitude, longitude, place_id } = geocodingData;
      const cityExists = await prisma.city.findUnique({
        where: { province_id_place_id: { province_id: province.id, place_id } },
      });
      if (cityExists) throw { code: '_', message: 'Esta cidade já está cadastrada!', statusCode: 422 };
      const city = await prisma.city.create({
        data: { name, latitude, longitude, place_id, province_id: attributes.province_id },
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
