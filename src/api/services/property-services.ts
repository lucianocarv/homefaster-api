import { prisma } from '../config/prisma-connect.js';
import { City, Community, Property, Province } from '@prisma/client';
import { PaginationParameters } from '../types/pagination-parameters.js';
import { PropertyWithAddressAndDescription, IPropertyUpdate } from '../types/create-property.js';
import { ValidateAddressAPI } from '../maps/validate-address-api.js';
import { _address, _description, _manager } from '../helpers/query-properties.js';
import { IPagination } from '../interfaces/pagination.js';
import { IAddressFilter } from '../interfaces/search-address.js';
import { IDescriptionFilter } from '../interfaces/search-filter.js';
import { MultipartFile } from '@fastify/multipart';
import { imageUpload } from '../storage/upload-image.js';
import { UploadImageTo } from '../types/upload-image-to.js';
import { CustomError } from '../helpers/custom-error.js';
import { IValidationAddressReply } from '../interfaces/validation-address-reply.js';
import { FastifyError } from 'fastify';

const propertyServices = {
  getAllProperties: async ({ page_number, per_page_number, skip }: PaginationParameters) => {
    const [properties, count] = await Promise.all([
      prisma.property.findMany({
        take: per_page_number,
        skip,
        include: {
          address: { select: _address },
          description: { select: _description },
          manager: { select: _manager },
        },
      }),
      prisma.property.count(),
    ]);
    return { count, page: page_number, per_page: per_page_number, properties };
  },

  getOneProperty: async (id: number): Promise<{} | Error> => {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        address: true,
        description: true,
        manager: true,
      },
    });

    if (!property) return CustomError('_', `O ID ${id} não corresponde a nenhuma propriedade!`, 406);

    const [f, u] = await Promise.all([
      prisma.featuresOnDescriptions.findMany({
        where: { description_id: property.description?.id },
        include: { feature: true },
      }),
      prisma.utilitiesOnDescriptions.findMany({
        where: { description_id: property.description?.id },
        include: { utility: true },
      }),
    ]);
    const [features, utilities] = [f.map((feature) => feature.feature.name), u.map((utility) => utility.utility.name)];
    return { ...property, features, utilities };
  },

  createOneProperty: async (attributes: PropertyWithAddressAndDescription): Promise<Property | FastifyError> => {
    const { property, description, address } = attributes;
    const { community_id } = attributes.property;
    const { name: community, city_id } = (await prisma.community.findUnique({ where: { id: community_id } })) as Community;
    const { name: city, province_id } = (await prisma.city.findUnique({ where: { id: city_id } })) as City;
    const { name: province } = (await prisma.province.findUnique({ where: { id: province_id } })) as Province;
    const validateAddress = (await ValidateAddressAPI.validatePropertyAddress({
      province,
      city,
      community,
      address: `${address.number} ${address.street}`,
    })) as IValidationAddressReply;

    if (validateAddress?.formatted_address) {
      const { postal_code, latitude, longitude, global_code, place_id, formatted_address } = validateAddress;
      const { id } = await prisma.property.create({
        data: {
          ...property,
          city_id,
          address: {
            create: {
              ...address,
              formatted_address,
              postal_code: postal_code!,
              global_code,
              place_id: place_id!,
              latitude,
              longitude,
              community,
              city,
              province,
            },
          },
          description: {
            create: {
              ...description,
            },
          },
        },
      });

      if (id) {
        const description = await prisma.description.findFirst({
          where: { property_id: id },
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
      const newProperty = await prisma.property.findUnique(
        {
          where: { id: id },
          include: {
            address: true,
            description: true,
            manager: true,
          },
        }!
      );

      return newProperty!;
    }
    return CustomError('_', 'Endereço inválido! Por favor, verifique as informações fornecidas!', 400);
  },

  filter: async ({
    pagination,
    description,
    address,
  }: {
    pagination: IPagination;
    description: IDescriptionFilter;
    address: IAddressFilter;
  }) => {
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
        city_id: { equals: address.city_id },
        community_id: { equals: address.community_id },
        address: {
          street: { contains: address.street },
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
            id: { equals: description.type },
          },
        },
      },
      orderBy: {
        description: {
          price: description.order == 'price_max' ? 'desc' : 'asc',
        },
      },
    });
    const count = properties.length;
    return { count, page: pagination.page_number, per_page: pagination.per_page_number, properties };
  },

  updateOneProperty: async (id: number, attributes: IPropertyUpdate) => {
    const property = await prisma.property.findUnique({ where: { id } });
    if (property && property.id) {
      const description = await prisma.description.findUnique({ where: { property_id: property.id } });
      if (description!.id) {
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
            await prisma.featuresOnDescriptions.deleteMany({ where: { description_id: description!.id } });
            await prisma
              .$transaction([
                prisma.featuresOnDescriptions.createMany({
                  data: attributes.features.map((feature) => ({ feature_id: feature, description_id: description!.id })),
                }),
              ])
              .catch(() => {
                throw CustomError('_', 'Feature incorreta não pode ser atualizada!', 400);
              });
          }
          if (attributes.utilities && attributes.utilities.length >= 1) {
            await prisma.utilitiesOnDescriptions.deleteMany({ where: { description_id: description!.id } });
            await prisma
              .$transaction([
                prisma.utilitiesOnDescriptions.createMany({
                  data: attributes.utilities.map((utility) => ({ utility_id: utility, description_id: description!.id })),
                }),
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

  uploadThumbImage: async (data: MultipartFile, to: UploadImageTo, id: number) => {
    const filename = data.filename.replace(/\b(\s)\b/g, '-');
    const property = await prisma.property.findUnique({ where: { id: Number(id) } });
    if (property) {
      const res = await imageUpload({ to, file: data.file, filename, id });
      return res;
    } else {
      return CustomError('_', 'Insira uma propriedade válida!', 400);
    }
  },

  deleteOneProperty: async (id: number) => {
    const property = await prisma.property.findUnique({ where: { id } });
    if (property) {
      await prisma.property.delete({ where: { id } });
      return { message: 'Propriedade excluída com sucesso!' };
    } else {
      throw { code: '_', message: 'Não foi possível excluir a propriedade!', statusCode: 400 };
    }
  },
};

export { propertyServices };
