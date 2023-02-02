import { prisma } from '../prisma-connect.js';
import { Property, UtilitiesOnPropertyInfos } from '@prisma/client';
import { PaginationParameters } from '../types/pagination-parameters.js';
import { CreateProperty } from '../types/create-property.js';

const propertyServices = {
  index: async ({ page_number, per_page_number, skip }: PaginationParameters) => {
    const properties = await prisma.property.findMany({
      take: per_page_number,
      skip,
      include: {
        address: true,
        property_info: {
          include: {
            features: {
              select: { feature: true },
            },
            utilities: {
              select: { utility: true },
            },
          },
        },
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
        formatted_address: true,
        community_name: true,
        city_name: true,
        province_name: true,
      },
    });
    const property_info = await prisma.propertyInfo.findUnique({
      where: { property_id: property!.id },
      select: {
        badrooms: true,
        price: true,
        furnished: true,
        rented: true,
        property_area: true,
        type: { select: { name: true } },
        id: true,
      },
    });
    const features_query: Array<{ features: string }> = await prisma.$queryRaw`
      SELECT features.name as features FROM property_infos
      JOIN features_on_propertyinfos ON features_on_propertyinfos.property_info_id = property_infos.id
      JOIN features ON features.id = features_on_propertyinfos.feature_id WHERE property_infos.id = ${property_info!.id}
    `;
    const utilities_query: Array<{ utilities: string }> = await prisma.$queryRaw`
      SELECT utilities.name as utilities FROM property_infos
      JOIN utilities_on_properties ON utilities_on_properties.property_info_id = property_infos.id
      JOIN utilities ON utilities.id = utilities_on_properties.utility_id WHERE property_infos.id = ${property_info!.id}
  `;
    const features = features_query.map((feature) => feature.features);
    const utilities = utilities_query.map((utility) => utility.utilities);
    return { ...property_info, ...property, ...address, features, utilities };
  },

  create: async (attributes: CreateProperty): Promise<Property> => {
    const { property, property_info, address } = attributes;
    const { location } = address;
    const _property = await prisma.property.create({
      data: {
        ...property,
        property_info: {
          create: {
            ...property_info,
          },
        },
        address: {
          create: {
            ...address,
            location: {
              create: {
                lat: location.lat,
                lng: location.lng,
              },
            },
          },
        },
      },
    });

    console.log(_property);

    if (_property.id) {
      const property_info = await prisma.propertyInfo.findFirst({
        where: { property_id: _property.id },
      });
      if (property_info) {
        await prisma.$transaction([
          prisma.utilitiesOnPropertyInfos.createMany({
            data: attributes.utilities.map((utility_id) => ({
              utility_id,
              property_info_id: property_info.id,
            })),
          }),
          prisma.featuresOnPropertyInfos.createMany({
            data: attributes.features.map((feature_id) => ({
              feature_id,
              property_info_id: property_info.id,
            })),
          }),
        ]);
      }
    }

    const newProperty = await prisma.property.findUnique({
      where: { id: _property.id },
      include: {
        address: { include: { location: true } },
        property_info: true,
        manager: true,
      },
    });
    return newProperty!;
  },
};

export { propertyServices };
