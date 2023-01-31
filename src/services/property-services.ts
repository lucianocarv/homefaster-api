import { prisma } from '../prisma-connect.js';
import { Property } from '@prisma/client';
import { PaginationParameters } from '../types/pagination-parameters.js';

export interface CreateProperty {
  property: {
    community_id: number;
    manager_id: number;
  };
  address: {
    number: number;
    street: string;
    postal_code: string | null;
    formatted_address: string | null;
    global_code: string | null;
    place_id: string | null;
    community_name: string;
    city_name: string;
    province_name: string;
    property_id?: number;
  };
  property_info: {
    price: number;
    badrooms: number;
    furnished: boolean;
    rented: boolean;
    property_area: number;
    type_id: number;
    property_id?: number;
  };
}

const propertyServices = {
  index: async ({ page_number, per_page_number, skip }: PaginationParameters) => {
    const properties = await prisma.property.findMany({
      take: per_page_number,
      skip,
    });
    return { page: page_number, per_page: per_page_number, properties };
  },

  create: async (attributes: CreateProperty): Promise<Property | undefined> => {
    const property = attributes.property;
    const property_info = attributes.property_info;
    const address = attributes.address;

    console.log(attributes);

    const { id } = await prisma.property.create({
      data: {
        ...property,
        property_info: {
          create: { ...property_info },
        },
        address: {
          create: { ...address, location: { create: { lat: 1.1, lng: 1.1 } } },
        },
      },
    });

    if (id) {
      const newProperty = await prisma.property.findUnique({
        where: { id },
        include: {
          address: true,
          property_info: true,
          manager: true,
        },
      });
      return newProperty!;
    }
  },
};

export { propertyServices };
