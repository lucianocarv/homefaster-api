import { prisma } from '../config/prisma/prisma-connect.js';
import { PaginationParameters } from '../interfaces/pagination-parameters.js';
import { IPagination } from '../interfaces/pagination.js';
import { IAddressFilter } from '../interfaces/search-address.js';
import { IDescriptionFilter } from '../interfaces/search-filter.js';
import { MultipartFile } from '@fastify/multipart';
import { CustomError } from '../helpers/custom-error.js';
import storageServices from './storage-services.js';
import { ICompleteProperty } from '../interfaces/complete-property.js';

const propertyServices = {
  // Funcionalidade básica criada (apenas refatorar)
  getAllProperties: async ({ page_number, per_page_number, skip }: PaginationParameters) => {
    const [properties, count] = await Promise.all([
      prisma.property.findMany({
        take: per_page_number,
        skip,
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
      }),
      prisma.property.count()
    ]);
    const pages = Math.ceil(count / per_page_number);
    return { count, page: page_number, per_page: per_page_number, pages, properties };
  },

  // Funcionalidade básica criada (apenas refatorar)
  getOneProperty: async (id: number): Promise<object | Error> => {
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
    if (property) {
      return property;
    } else {
      throw new Error('Error');
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
  updatePropertyDescription: async (id: number, user_id: number, attributes: ICompleteProperty) => {
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
                furnished: attributes.description.furnished,
                pets_cats: attributes.description.pets_cats,
                pets_dogs: attributes.description.pets_dogs,
                smoking: attributes.description.smoking,
                property_area: attributes.description.property_area
              }
            }
          }
        });
        if (attributes.features || attributes.utilities) {
          if (attributes.features && attributes.features.length >= 1) {
            await prisma.featuresOnDescriptions.deleteMany({ where: { description_id: description?.id } });
            await prisma
              .$transaction([
                prisma.featuresOnDescriptions.createMany({
                  data: attributes.features.map(feature => ({ feature_id: feature, description_id: description?.id }))
                })
              ])
              .catch(() => {
                throw CustomError('_', 'Feature incorreta não pode ser atualizada!', 400);
              });
          }

          if (attributes.utilities && attributes.utilities.length >= 1) {
            await prisma.utilitiesOnDescriptions.deleteMany({ where: { description_id: description?.id } });
            await prisma
              .$transaction([
                prisma.utilitiesOnDescriptions.createMany({
                  data: attributes.utilities.map(utility => ({ utility_id: utility, description_id: description?.id }))
                })
              ])
              .catch(() => {
                throw CustomError('_', 'Utilidade incorreta não pode ser atualizada', 400);
              });
          }
        }
        const property = await propertyServices.getOneProperty(id);
        return property;
      }
    }
  },

  uploadImage: async (data: MultipartFile, id: number) => {
    const filename = data.filename.replace(/\b(\s)\b/g, '-');
    const property = await prisma.property.findUnique({ where: { id } });
    if (property) {
      const response = await storageServices.uploadFile({ to: 'properties', file: data.file, filename, id });
      const newImageUrl = `/properties/${id}/${filename}`;
      await prisma.images.create({
        data: {
          url: newImageUrl,
          property_id: id
        }
      });
      return { url: newImageUrl, response };
    } else {
      return CustomError('_', 'Insira uma propriedade válida!', 400);
    }
  },

  getImages: async (property_id: number) => {
    try {
      const images = await prisma.images.findMany({ where: { property_id } });
      return images;
    } catch (error) {
      return error;
    }
  },

  filter: async ({
    pagination,
    description,
    address
  }: {
    pagination: IPagination;
    description: IDescriptionFilter;
    address: IAddressFilter;
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
            street: { contains: address.street }
          },
          description: {
            price: { lte: description.price_max, gte: description.price_min },
            badrooms: { equals: description.badrooms },
            bathrooms: { equals: description.bathrooms },
            furnished: { equals: description.furnished },
            pets_cats: { equals: description.pets_cats },
            pets_dogs: { equals: description.pets_dogs },
            smoking: { equals: description.smoking },
            type: {
              id: { equals: description.type }
            }
          }
        },
        orderBy: {
          description: {
            price: description.order == 'price_max' ? 'desc' : 'asc'
          }
        }
      }),
      prisma.property.count({
        where: {
          address: {
            street: { contains: address.street }
          },
          description: {
            price: { lte: description.price_max, gte: description.price_min },
            badrooms: { equals: description.badrooms },
            bathrooms: { equals: description.bathrooms },
            furnished: { equals: description.furnished },
            pets_cats: { equals: description.pets_cats },
            pets_dogs: { equals: description.pets_dogs },
            smoking: { equals: description.smoking },
            type: {
              id: { equals: description.type }
            }
          }
        }
      })
    ]);
    const pages = Math.ceil(count / pagination.per_page_number);
    return { count, page: pagination.page_number, per_page: pagination.per_page_number, pages, properties };
  },

  deleteOneProperty: async (id: number) => {
    const property = await prisma.property.findUnique({ where: { id } });
    if (property) {
      await prisma.property.delete({ where: { id } });
      return { message: 'Propriedade excluída com sucesso!' };
    } else {
      throw { code: '_', message: 'Não foi possível excluir a propriedade!', statusCode: 400 };
    }
  }
};

export { propertyServices };
