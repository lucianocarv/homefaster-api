import { prisma } from '../../config/prisma/prisma.config';
import { IPagination } from '../interfaces/pagination.js';
import { PropertyFilterProperties } from '../interfaces/search-filter.js';
import { MultipartFile } from '@fastify/multipart';
import storageServices from './storage.services.js';
import { IPropertyUpdateAttributes } from '../interfaces/complete-property.js';
import { Property } from '@prisma/client';
import { ERR_PROPERTY_CANNOT_BE_EXCLUDE, ERR_PROPERTY_NOT_FOUND } from '../errors/property.erros.js';
import { ERR_FEATURE_UPDATE_FAILED } from '../errors/feature.errors.js';
import { ERR_UTILITY_UPDATE_FAILED } from '../errors/utility.errors.js';
import { randomUUID } from 'crypto';
import { CustomError } from '../helpers/custom-error';

const propertyServices = {
  properties: async ({
    pagination,
    propertiesParams
  }: {
    pagination: IPagination;
    propertiesParams: PropertyFilterProperties;
  }) => {
    const [properties, count] = await Promise.all([
      prisma.property.findMany({
        skip: pagination.skip,
        take: pagination.per_page_number,
        include: {
          address: true,
          description: {
            include: {
              type: true
            }
          }
        },
        where: {
          address: {
            province: {
              equals: propertiesParams.province,
              mode: 'insensitive'
            },
            city: {
              equals: propertiesParams.city,
              mode: 'insensitive'
            },
            community: {
              equals: propertiesParams.community,
              mode: 'insensitive'
            }
          },
          description: {
            price: { lte: propertiesParams.price_max, gte: propertiesParams.price_min },
            badrooms: { equals: propertiesParams.badrooms },
            bathrooms: { equals: propertiesParams.bathrooms },
            furnished: { equals: propertiesParams.furnished },
            pets_cats: { equals: propertiesParams.pets_cats },
            pets_dogs: { equals: propertiesParams.pets_dogs },
            smoking: { equals: propertiesParams.smoking },
            rented: false,
            type: {
              id: { equals: propertiesParams.type_id }
            }
          }
        }
      }),
      prisma.property.count({
        where: {
          address: {
            province: {
              equals: propertiesParams.province,
              mode: 'insensitive'
            },
            city: {
              equals: propertiesParams.city,
              mode: 'insensitive'
            },
            community: {
              equals: propertiesParams.community,
              mode: 'insensitive'
            }
          },
          description: {
            price: { lte: propertiesParams.price_max, gte: propertiesParams.price_min },
            badrooms: { equals: propertiesParams.badrooms },
            bathrooms: { equals: propertiesParams.bathrooms },
            furnished: { equals: propertiesParams.furnished },
            pets_cats: { equals: propertiesParams.pets_cats },
            pets_dogs: { equals: propertiesParams.pets_dogs },
            smoking: { equals: propertiesParams.smoking },
            rented: false,
            type: {
              id: { equals: propertiesParams.type_id }
            }
          }
        }
      })
    ]);
    const pages = Math.ceil(count / pagination.per_page_number);
    return { count, page: pagination.page_number, per_page: pagination.per_page_number, pages, properties };
  },
  // Funcionalidade básica criada (apenas refatorar)
  getOneProperty: async (id: number): Promise<Property | boolean> => {
    try {
      const property = await prisma.property.findUnique({
        where: { id },
        include: {
          address: true,
          description: {
            include: {
              features: {
                select: {
                  feature: { select: { name: true } }
                }
              },
              utilities: {
                select: {
                  utility: { select: { name: true } }
                }
              }
            }
          }
        }
      });
      if (property) return property;
      return false;
    } catch (error) {
      throw error;
    }
  },

  // Funcionalidade básica criada (apenas refatorar)
  createOneProperty: async (data: any, user_id: number) => {
    const [description, address] = [data.description, data.address];
    const [utilities, features] = [data.utilities as number[], data.features as number[]];

    try {
      return await prisma.$transaction(async tx => {
        const property = await tx.property.create({ data: { user_id } });
        const { id: did } = await tx.description.create({
          data: { property_id: property.id, ...description, user_id }
        });

        await tx.address.create({ data: { ...address, property_id: property.id, user_id } });
        features.forEach(async f => await tx.featuresOnDescriptions.create({ data: { description_id: did, feature_id: f } }));
        utilities.forEach(async u => await tx.utilitiesOnDescriptions.create({ data: { description_id: did, utility_id: u } }));

        return await tx.property.findUnique({
          where: { id: property.id },
          include: { description: true, address: true }
        });
      });
    } catch (error) {
      return error;
    }
  },

  // Funcionalidade básica criada (apenas refatorar)
  findPropertyByPlaceId: async (place_id: string): Promise<Boolean | Error> => {
    try {
      const address = await prisma.address.findUnique({ where: { place_id } });
      if (address) return true;
      return false;
    } catch (error) {
      return error as Error;
    }
  },

  // Funcionalidade básica criada (apenas refatorar)
  updatePropertyDescription: async (id: number, user_id: number, attributes: IPropertyUpdateAttributes) => {
    const property = await prisma.property.findFirst({ where: { id, user_id } });
    if (property && property.id) {
      const description = await prisma.description.findUnique({ where: { property_id: property.id } });
      if (description?.id) {
        await prisma.property.update({
          where: { id },
          data: {
            description: {
              update: {
                title: attributes.description.title,
                img_cover: attributes.description.img_cover,
                badrooms: attributes.description.badrooms,
                bathrooms: attributes.description.bathrooms,
                price: attributes.description.price,
                rented: attributes.description.rented,
                furnished: attributes.description.furnished,
                pets_cats: attributes.description.pets_cats,
                pets_dogs: attributes.description.pets_dogs,
                smoking: attributes.description.smoking,
                property_area: attributes.description.property_area
              }
            }
          }
        });
        if (attributes.features && attributes.features.length >= 1) {
          propertyServices.updatePropertyFeatures(attributes.features, description.id);
        }
        if (attributes.utilities && attributes.utilities.length >= 1) {
          propertyServices.updatePropertyUtilities(attributes.utilities, description.id);
        }
        const property = await propertyServices.getOneProperty(id);
        return property;
      }
    }
  },

  updatePropertyFeatures: async (features: number[], description_id: number) => {
    await prisma.$transaction(async tx => {
      await tx.featuresOnDescriptions.deleteMany({ where: { description_id: description_id } });
      await tx.featuresOnDescriptions
        .createMany({
          data: features.map(feature => ({ feature_id: feature, description_id: description_id }))
        })
        .catch(() => {
          throw ERR_FEATURE_UPDATE_FAILED;
        });
    });
  },

  updatePropertyUtilities: async (utilities: number[], description_id: number, tx = prisma) => {
    await prisma.$transaction(async tx => {
      await tx.utilitiesOnDescriptions.deleteMany({ where: { description_id: description_id } });
      await tx.utilitiesOnDescriptions
        .createMany({
          data: utilities.map(feature => ({ utility_id: feature, description_id: description_id }))
        })
        .catch(() => {
          throw ERR_UTILITY_UPDATE_FAILED;
        });
    });
  },

  uploadImage: async (data: MultipartFile, property_id: number, user_id: number) => {
    try {
      const property = await prisma.property.findFirst({ where: { id: property_id, user_id } });
      if (!property) throw ERR_PROPERTY_NOT_FOUND;

      const filename = randomUUID() + '_' + user_id + '_' + property_id;
      const path = `properties/images/${property.id}/${filename}`;
      const response = await storageServices.uploadFile({ file: data.file, path });
      if (response !== undefined) {
        const image = await prisma.image.create({
          data: {
            url: response.filePath,
            property_id: property_id,
            user_id
          }
        });
        return image;
      }
    } catch (error) {
      return error;
    }
  },

  getImages: async (property_id: number) => {
    try {
      const images = await prisma.image.findMany({ where: { property_id } });
      return images;
    } catch (error) {
      return error;
    }
  },

  deleteImage: async (image_id: number, user_id: number) => {
    const imageExists = await prisma.image.findUnique({
      where: { id_user_id: { id: image_id, user_id } }
    });
    if (imageExists) {
      const deleteImage = await storageServices.deleteFile(imageExists.url);
      await prisma.image.delete({ where: { id: image_id } });
      return { deleteImage };
    } else {
      return CustomError('_', 'Não foi possível encontrar a imagem selecionada!', 400);
    }
  },

  deleteOneProperty: async (id: number, user_id: number) => {
    const userProperty = await prisma.property.findFirst({ where: { id, user_id } });
    if (!userProperty) throw ERR_PROPERTY_CANNOT_BE_EXCLUDE;
    await prisma.property.delete({ where: { id } });
    return { message: 'Propriedade excluída com sucesso!' };
  }
};

export { propertyServices };
