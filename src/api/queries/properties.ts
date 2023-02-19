import { prisma } from '../config/prisma-connect';

export const propertyQueries = {
  getOne: async (id: number) => {
    const _properties: Array<{}> = await prisma.$queryRaw`
      SELECT 
        properties.id as id,
        p_addresses.id as address_id,
        p_addresses.number,
        p_addresses.street,
        p_addresses.postal_code,
        p_addresses.global_code,
        p_addresses.place_id,
        p_addresses.latitude,
        p_addresses.longitude,
        p_addresses.community,
        p_addresses.city,
        p_addresses.province,
        p_addresses.formatted_address,
        p_descriptions.id as description_id,
        p_descriptions.title,
        p_descriptions.price,
        p_descriptions.bathrooms,
        p_descriptions.badrooms,
        p_descriptions.furnished,
        p_descriptions.rented,
        p_descriptions.property_area,
        p_descriptions.pets_cats,
        p_descriptions.pets_dogs,
        p_descriptions.smoking,
        p_managers.name as manager,
        p_managers.email as email,
        p_managers.phone as phone,
        p_managers.website as website,
        p_managers.img_logo as img_logo
      FROM properties
      JOIN p_addresses ON p_addresses.property_id = properties.id
      JOIN p_descriptions ON p_descriptions.property_id = properties.id
      JOIN p_managers ON properties.manager_id = p_managers.id
      WHERE properties.id = ${id}
    `;
    return _properties[0];
  },

  getMany: async () => {
    const _properties: Array<{}> = await prisma.$queryRaw`
      SELECT 
        properties.id as id,
        p_addresses.id as address_id,
        p_addresses.number,
        p_addresses.street,
        p_addresses.postal_code,
        p_addresses.global_code,
        p_addresses.place_id,
        p_addresses.latitude,
        p_addresses.longitude,
        p_addresses.community,
        p_addresses.city,
        p_addresses.province,
        p_addresses.formatted_address,
        p_descriptions.id as description_id,
        p_descriptions.title,
        p_descriptions.price,
        p_descriptions.bathrooms,
        p_descriptions.badrooms,
        p_descriptions.furnished,
        p_descriptions.rented,
        p_descriptions.property_area,
        p_descriptions.pets_cats,
        p_descriptions.pets_dogs,
        p_descriptions.smoking,
        p_managers.name as manager,
        p_managers.email as email,
        p_managers.phone as phone,
        p_managers.website as website,
        p_managers.img_logo as img_logo
        
      FROM properties
      JOIN p_addresses ON p_addresses.property_id = properties.id
      JOIN p_descriptions ON p_descriptions.property_id = properties.id
      JOIN p_managers ON properties.manager_id = p_managers.id
    `;
    return _properties;
  },
};
