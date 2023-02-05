import { prisma } from '../config/prisma-connect.js';
import { City, Community, Property, Province } from '@prisma/client';
import { PaginationParameters } from '../types/pagination-parameters.js';
import { CreateProperty } from '../types/create-property.js';
import { ValidateAddressAPI, IReplyOfValidateAddressAPI } from '../maps/validate-address-api.js';

const propertyServices = {
  index: async ({ page_number, per_page_number, skip }: PaginationParameters) => {
    const properties = await prisma.property.findMany({
      take: per_page_number,
      skip,
      include: {
        address: true,
        description: true,
        manager: true,
      },
    });
    return { page: page_number, per_page: per_page_number, properties };
  },

  getOneProperty: async (id: number) => {
    const property = await prisma.property.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });
    const address = await prisma.address.findUnique({
      where: { property_id: property!.id },
      select: {
        number: true,
        street: true,
        postal_code: true,
        global_code: true,
        place_id: true,
        community: true,
        city: true,
        province: true,
        formatted_address: true,
      },
    });
    const property_info = await prisma.description.findUnique({
      where: { property_id: property!.id },
      select: {
        bathrooms: true,
        badrooms: true,
        price: true,
        furnished: true,
        rented: true,
        property_area: true,
        type: { select: { name: true } },
        id: true,
      },
    });

    const features_query: Array<{ feature: string; type: string }> = await prisma.$queryRaw`
      SELECT features.name as feature, features.type as type FROM property_infos
      JOIN features_on_propertyinfos ON features_on_propertyinfos.property_info_id = property_infos.id
      JOIN features ON features.id = features_on_propertyinfos.feature_id WHERE property_infos.id = ${property_info!.id}
    `;
    const utilities_query: Array<{ utility: string }> = await prisma.$queryRaw`
      SELECT utilities.name as utility FROM property_infos
      JOIN utilities_on_propertyinfos ON utilities_on_propertyinfos.property_info_id = property_infos.id
      JOIN utilities ON utilities.id = utilities_on_propertyinfos.utility_id WHERE property_infos.id = ${property_info!.id}
  `;
    const features = features_query.map(({ feature, type }) => ({ feature, type }));
    const utilities = utilities_query.map((utility) => utility.utility);
    return { ...property_info, ...property, ...address, features, utilities };
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
