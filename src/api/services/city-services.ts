import { prisma } from '../config/prisma-connect.js';
import { City, Province } from '@prisma/client';
import { PaginationParameters } from '../types/pagination-parameters.js';
import { GeocodingAPI } from '../maps/geocode-api.js';
import { IUpdateCity } from '../interfaces/update-city.js';

const citiesServices = {
  index: async ({ page_number, per_page_number, skip }: PaginationParameters): Promise<Object> => {
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
    return { page: page_number, per_page: per_page_number, cities };
  },

  create: async (attributes: City): Promise<City | Error> => {
    const { short_name } = (await prisma.province.findUnique({ where: { id: attributes.province_id } })) as Province;
    const geocode = await GeocodingAPI.getDataForCity(short_name, attributes.name);
    if (typeof geocode === 'object') {
      const { latitude, longitude, place_id } = geocode;
      const city = await prisma.city.create({
        data: { ...attributes, latitude, longitude, place_id },
      });
      return city;
    } else {
      return new Error(`Invalid City: (${geocode})`);
    }
  },

  update: async ({ id, attributes }: { id: number; attributes: IUpdateCity }): Promise<City> => {
    const city = await prisma.city.update({
      where: { id },
      data: attributes,
    });
    return city;
  },

  delete: async ({ id }: { id: number }): Promise<City> => {
    const city = await prisma.city.delete({
      where: { id },
    });
    return city;
  },
};

export { citiesServices };
