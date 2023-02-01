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
    const property = await prisma.$queryRaw`
      SELECT 
      properties.id as id,
      addresses.number as number,
      addresses.street as street,
      addresses.community_name as community,
      addresses.city_name as city,
      property_infos.price as price,
      property_infos.furnished as furnished,
      string_agg(utilities.name, ',') as utilities
    FROM properties 
    INNER JOIN addresses ON properties.id = addresses.property_id
    INNER JOIN property_infos ON properties.id = property_infos.property_id
	  INNER JOIN utilities_on_properties ON property_infos.id = utilities_on_properties.property_info_id
	  INNER JOIN utilities ON utilities_on_properties.utility_id = utilities.id
	  WHERE properties.id = 12
	  GROUP BY ALL
	  	properties.id, 
      addresses.number,
      addresses.street,
	  	addresses.community_name,
      addresses.city_name,
      property_infos.price,
	  	property_infos.furnished
	  UNION
	  SELECT 
      properties.id as id,
      addresses.number as number,
      addresses.street as street,
      addresses.community_name as community,
      addresses.city_name as city,
      property_infos.price as price,
      property_infos.furnished as furnished,
      string_agg(features.name, ',') as features
    FROM properties 
    INNER JOIN addresses ON properties.id = addresses.property_id
    INNER JOIN property_infos ON properties.id = property_infos.property_id
	  INNER JOIN features_on_propertyinfos ON property_infos.id = features_on_propertyinfos.property_info_id
	  INNER JOIN features ON features_on_propertyinfos.feature_id = features.id
	  WHERE properties.id = ${id}
	  GROUP BY ALL
	  	properties.id, 
      addresses.number,
      addresses.street,
	  	addresses.community_name,
      addresses.city_name,
      property_infos.price,
	  	property_infos.furnished
    `;

    return property;
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
