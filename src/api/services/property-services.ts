import { prisma } from '../config/prisma-connect.js';
import { City, Community, Property, Province } from '@prisma/client';
import { PaginationParameters } from '../types/pagination-parameters.js';
import { CreateProperty } from '../types/create-property.js';
import { ValidateAddressAPI } from '../maps/validate-address-api.js';
import { _address, _description, _manager } from '../helpers/query-properties.js';
import { IPagination } from '../interfaces/pagination.js';
import { ISearchAddress } from '../interfaces/search-address.js';
import { IFilter } from '../interfaces/search-filter.js';

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

  getOneProperty: async (id: number) => {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        address: true,
        description: true,
        manager: true,
      },
    });
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
    const fullProperty = { ...property } as { features: string[]; utilities: string[] };
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

  create: async (attributes: CreateProperty): Promise<Property | Error> => {
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

    return new Error('Invalid Property Creation');
  },
};

export { propertyServices };
