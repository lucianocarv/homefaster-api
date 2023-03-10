import { prisma } from '../config/prisma-connect.js';
import { Address, City, Community, Description, Manager, Property, Province } from '@prisma/client';
import { PaginationParameters } from '../types/pagination-parameters.js';
import { PropertyWithAddressAndDescription, PropertyWithAddressAndDescriptionUpdate } from '../types/create-property.js';
import { ValidateAddressAPI } from '../maps/validate-address-api.js';
import { _address, _description, _manager } from '../helpers/query-properties.js';
import { IPagination } from '../interfaces/pagination.js';
import { ISearchAddress } from '../interfaces/search-address.js';
import { IFilter } from '../interfaces/search-filter.js';
import { storage } from '../storage/google-cloud-storage.js';
import { MultipartFile } from '@fastify/multipart';

import fs from 'fs';
import util from 'util';
import { pipeline, Readable } from 'stream';
import path from 'path';
import { streamToBuffer } from '../helpers/stream-to-buffer.js';
import { IFullProperty } from '../interfaces/full-property.js';
import { imageUpload } from '../storage/upload-image.js';
import { UploadImageTo } from '../types/upload-image-to.js';
import { provinceServices } from './province-services.js';
import { citiesServices } from './city-services.js';
const pump = util.promisify(pipeline);

const propertyServices = {
  index: async ({ page_number, per_page_number, skip }: PaginationParameters) => {
    const properties = await prisma.property.findMany({
      take: per_page_number,
      skip,
      include: {
        address: { select: _address },
        description: { select: _description },
        manager: { select: _manager },
      },
    });
    return { page: page_number, per_page: per_page_number, properties };
  },

  property: async (id: number) => {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        address: true,
        description: true,
        manager: true,
      },
    });
    if (!property) return 'A propriedade informada não existe!';
    const _features = await prisma.featuresOnDescriptions.findMany({
      where: { description_id: property?.description?.id },
      include: { feature: true },
    });
    const _utilities = await prisma.utilitiesOnDescriptions.findMany({
      where: { description_id: property?.description?.id },
      include: { utility: true },
    });
    const features = _features.map((feature) => feature.feature.name);
    const utilities = _utilities.map((utility) => utility.utility.name);
    const fullProperty = { ...property } as IFullProperty;
    fullProperty.features = features;
    fullProperty.utilities = utilities;
    return fullProperty;
  },

  searchByAddress: async ({ pagination, address }: { pagination: IPagination; address: ISearchAddress }) => {
    address.community ? '' : (address.community = '');
    address.street ? '' : (address.street = '');
    console.log(address.city);
    const properties = await prisma.property.findMany({
      skip: pagination.skip,
      take: pagination.per_page_number,
      include: {
        address: true,
        description: {
          include: {
            type: true,
          },
        },
        manager: true,
      },
      where: {
        address: {
          city: {
            contains: address.city,
            mode: 'insensitive',
          },
          community: {
            contains: address.community,
            mode: 'insensitive',
          },
          formatted_address: {
            contains: address.street,
            mode: 'insensitive',
          },
        },
      },
    });
    const count = properties.length;
    return { count, page: pagination.page_number, per_page: pagination.per_page_number, properties };
  },

  filterByDescription: async ({ pagination, filters }: { pagination: IPagination; filters: IFilter }) => {
    console.log(filters);
    const properties = await prisma.property.findMany({
      skip: pagination.skip,
      take: pagination.per_page_number,
      include: {
        address: true,
        description: {
          include: {
            type: true,
          },
        },
        manager: true,
      },
      where: {
        description: {
          price: { lte: filters.price_max, gte: filters.price_min },
          badrooms: { equals: filters.badrooms },
          bathrooms: { equals: filters.bathrooms },
          furnished: { equals: filters.furnished },
          pets_cats: { equals: filters.pets_cats },
          pets_dogs: { equals: filters.pets_dogs },
          smoking: { equals: filters.smoking },
          type: {
            name: { equals: filters.type, mode: 'insensitive' },
          },
        },
      },
    });
    const count = properties.length;
    return { count, page: pagination.page_number, per_page: pagination.per_page_number, properties };
  },

  create: async (attributes: PropertyWithAddressAndDescription): Promise<Property | Error> => {
    const { property, description, address } = attributes;
    const { community_id } = attributes.property;
    const { name: community_name, city_id } = (await prisma.community.findUnique({ where: { id: community_id } })) as Community;
    const { name: city_name, province_id } = (await prisma.city.findUnique({ where: { id: city_id } })) as City;
    const { name: province_name } = (await prisma.province.findUnique({ where: { id: province_id } })) as Province;

    const geocodeAPI = await ValidateAddressAPI.getDataForProperty({
      province: province_name,
      city: city_name,
      community: community_name,
      address: `${address.number} ${address.street}`,
    });

    if (typeof geocodeAPI == 'object') {
      const { postal_code, latitude, longitude, global_code, place_id, formatted_address } = geocodeAPI;

      const _property = await prisma.property.create({
        data: {
          ...property,
          city_id,
          address: {
            create: {
              ...address,
              formatted_address,
              postal_code,
              global_code,
              place_id,
              latitude,
              longitude,
              community: community_name,
              city: city_name,
              province: province_name,
            },
          },
          description: {
            create: {
              ...description,
            },
          },
        },
      });

      if (_property.id) {
        const description = await prisma.description.findFirst({
          where: { property_id: _property.id },
        });
        if (description) {
          await prisma.$transaction([
            prisma.utilitiesOnDescriptions.createMany({
              data: attributes.utilities.map((utility) => ({ description_id: description.id, utility_id: utility })),
            }),
            prisma.featuresOnDescriptions.createMany({
              data: attributes.features.map((feature) => ({ description_id: description.id, feature_id: feature })),
            }),
          ]);
        }
      }
      const newProperty = await prisma.property.findUnique({
        where: { id: _property.id },
        include: {
          address: true,
          description: true,
          manager: true,
        },
      });
      return newProperty!;
    }

    return new Error(`Erro ao criar propriedade: (${geocodeAPI})`);
  },
  update: async (id: number, attributes: PropertyWithAddressAndDescriptionUpdate) => {
    const _property = await prisma.property.findUnique({ where: { id } });
    if (_property && _property.id) {
      const desc = await prisma.description.findUnique({ where: { property_id: _property.id } });
      console.log(attributes);
      if (desc!.id) {
        await prisma.property.update({
          where: { id },
          data: {
            description: {
              update: {
                title: attributes.description.title,
                thumb: attributes.description.thumb,
                badrooms: attributes.description.badrooms,
                bathrooms: attributes.description.bathrooms,
                price: attributes.description.price,
                furnished: attributes.description.furnished,
                pets_cats: attributes.description.pets_cats,
                pets_dogs: attributes.description.pets_dogs,
                smoking: attributes.description.smoking,
                property_area: attributes.description.property_area,
              },
            },
          },
        });
        if (attributes.features || attributes.utilities) {
          if (attributes.features && attributes.features.length >= 1) {
            await prisma.featuresOnDescriptions.deleteMany({ where: { description_id: desc!.id } });
            await prisma
              .$transaction([
                prisma.featuresOnDescriptions.createMany({
                  data: attributes.features.map((feature) => ({ feature_id: feature, description_id: desc!.id })),
                }),
              ])
              .catch((err) => {
                throw { message: 'Feature incorreta não pode ser atualizada', code: err.code };
              });
          }
          if (attributes.utilities && attributes.utilities.length >= 1) {
            await prisma.utilitiesOnDescriptions.deleteMany({ where: { description_id: desc!.id } });
            await prisma
              .$transaction([
                prisma.utilitiesOnDescriptions.createMany({
                  data: attributes.utilities.map((utility) => ({ utility_id: utility, description_id: desc!.id })),
                }),
              ])
              .catch((err) => {
                throw { message: 'Utilidade incorreta não pode ser atualizada', code: err.code };
              });
          }
        }
        const property = await propertyServices.property(id);
        return property;
      }
    }
  },

  uploadThumb: async (data: MultipartFile, to: UploadImageTo, id: number) => {
    const filename = data.filename.replace(/\b(\s)\b/g, '-');
    const property = await prisma.property.findUnique({ where: { id: Number(id) } });
    if (property) {
      const res = await imageUpload({ to, file: data.file, filename, id });
      return res;
    } else {
      return { message: 'A propriedade informada não existe!' };
    }
  },
};

export { propertyServices };
