import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { getPagination } from '../helpers/get-pagination';
import { PropertyFilterPropertiesController } from '../interfaces/search-filter';
import { propertyServices } from '../services/property.services';
import { ERR_UPLOAD_MISSING_FILE, ERR_UPLOAD_MISSING_PROPERTY } from '../errors/upload.errors';
import { IPropertyUpdateAttributes } from '../interfaces/complete-property';
import { Address, Description, Property } from '@prisma/client';
import { AddressModel, DescriptionModel } from '../../../prisma/models';
import { ERR_PROPERTY_ALREADY_EXISTS, ERR_PROPERTY_NOT_FOUND } from '../errors/property.erros';
import { checkThatTheReceivedValueIsNotAnEmptyString, checkIfReceivedValueIsNumberOrBoolean } from '../helpers/type-checks';

const propertyController = {
  properties: async (req: FastifyRequest, res: FastifyReply): Promise<Object | FastifyError> => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);
    const propertiesParams = req.body as PropertyFilterPropertiesController;

    propertiesParams.province = checkThatTheReceivedValueIsNotAnEmptyString(propertiesParams.province);
    propertiesParams.city = checkThatTheReceivedValueIsNotAnEmptyString(propertiesParams.city);
    propertiesParams.community = checkThatTheReceivedValueIsNotAnEmptyString(propertiesParams.community);
    propertiesParams.bathrooms = checkIfReceivedValueIsNumberOrBoolean(propertiesParams.bathrooms);
    propertiesParams.badrooms = checkIfReceivedValueIsNumberOrBoolean(propertiesParams.badrooms);
    propertiesParams.price_max = checkIfReceivedValueIsNumberOrBoolean(propertiesParams.price_max);
    propertiesParams.price_min = checkIfReceivedValueIsNumberOrBoolean(propertiesParams.price_min);
    propertiesParams.pets_cats = checkIfReceivedValueIsNumberOrBoolean(propertiesParams.pets_cats);
    propertiesParams.pets_dogs = checkIfReceivedValueIsNumberOrBoolean(propertiesParams.pets_dogs);
    propertiesParams.furnished = checkIfReceivedValueIsNumberOrBoolean(propertiesParams.furnished);
    propertiesParams.smoking = checkIfReceivedValueIsNumberOrBoolean(propertiesParams.smoking);
    propertiesParams.type_id = checkIfReceivedValueIsNumberOrBoolean(propertiesParams.type_id);

    try {
      const properties = await propertyServices.properties({
        pagination: { page_number, per_page_number, skip },
        propertiesParams
      });
      return res.send(properties);
    } catch (error) {
      return res.send(error);
    }
  },

  getOneProperty: async (req: FastifyRequest, res: FastifyReply): Promise<Property | FastifyError> => {
    const { id } = req.params as { id: string };
    try {
      const property = await propertyServices.getOneProperty(Number(id));
      if (!property) throw ERR_PROPERTY_NOT_FOUND;
      return res.send(property);
    } catch (error) {
      return res.send(error);
    }
  },

  createOneProperty: async (req: FastifyRequest, res: FastifyReply): Promise<Property | FastifyError> => {
    const user = req.user as { id: number; role: string };
    const data = req.body as { description: Description; address: Address; features: number[]; utilities: number[] };

    const parseDescription = DescriptionModel.partial({
      id: true,
      rented: true,
      property_id: true,
      user_id: true,
      created_at: true,
      updated_at: true
    }).safeParse(data.description);

    const parseAddress = AddressModel.partial({
      id: true,
      created_at: true,
      property_id: true,
      user_id: true,
      updated_at: true
    }).safeParse(data.address);

    if (!parseDescription.success) {
      res.status(400);
      throw parseDescription.error.issues;
    }

    if (!parseAddress.success) {
      res.status(400);
      throw parseAddress.error.issues;
    }

    try {
      const propertyExists = await propertyServices.findPropertyByPlaceId(data.address.place_id);
      if (propertyExists) throw ERR_PROPERTY_ALREADY_EXISTS;
      const result = await propertyServices.createOneProperty(data, user.id);
      return res.status(201).send(result);
    } catch (error) {
      return res.send(error);
    }
  },

  validateEntriesToCreateAProperty: async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as { description: Description; address: Address; features: number[]; utilities: number[] };
    const parseDescription = DescriptionModel.partial({
      id: true,
      rented: true,
      property_id: true,
      user_id: true,
      created_at: true,
      updated_at: true
    }).safeParse(data.description);

    const parseAddress = AddressModel.partial({
      id: true,
      created_at: true,
      property_id: true,
      user_id: true,
      updated_at: true
    }).safeParse(data.address);

    if (!parseDescription.success) {
      res.status(400);
      throw parseDescription.error.issues;
    }

    if (!parseAddress.success) {
      res.status(400);
      throw parseAddress.error.issues;
    }

    return true;
  },

  updateOneProperty: async (req: FastifyRequest, res: FastifyReply): Promise<Property | FastifyError> => {
    const { id: user_id } = req.user as { role: string; id: number };
    const { id } = req.params as { id: string };
    const attributes = req.body as IPropertyUpdateAttributes;
    try {
      const property = await propertyServices.updatePropertyDescription(Number(id), user_id, attributes);
      return res.status(202).send(property);
    } catch (error) {
      return res.send(error);
    }
  },

  uploadImage: async (req: FastifyRequest, res: FastifyReply): Promise<{ message: string } | FastifyError> => {
    const data = await req.file();
    const { id: user_id } = req.user as { id: string };
    const { id: property_id } = req.params as { id: string };
    if (!data?.file) throw ERR_UPLOAD_MISSING_FILE;
    if (!property_id) throw ERR_UPLOAD_MISSING_PROPERTY;
    try {
      const result = await propertyServices.uploadImage(data, Number(property_id), Number(user_id));
      return res.status(202).send(result);
    } catch (error) {
      return res.send(error);
    }
  },
  deleteImage: async (req: FastifyRequest, res: FastifyReply) => {
    const { id: user_id } = req.user as { id: number };
    const { id: image_id } = req.query as { id: string };
    try {
      const response = await propertyServices.deleteImage(Number(image_id), user_id);
      return res.send(response);
    } catch (error) {
      return res.send(error);
    }
  },

  getImages: async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    try {
      const propertyExists = await propertyServices.getOneProperty(Number(id));
      if (!propertyExists) throw ERR_PROPERTY_NOT_FOUND;
      const images = await propertyServices.getImages(Number(id));
      return res.send(images);
    } catch (error) {
      return res.send(error);
    }
  },

  deleteOneProperty: async (req: FastifyRequest, res: FastifyReply) => {
    const { id: user_id } = req.user as { id: string };
    const { id } = req.params as { id: string };
    try {
      const propertyExists = await propertyServices.getOneProperty(Number(id));
      if (!propertyExists) throw ERR_PROPERTY_NOT_FOUND;
      const property = await propertyServices.deleteOneProperty(Number(id), Number(user_id));
      return res.status(202).send(property);
    } catch (error) {
      return res.send(error);
    }
  }
};

export { propertyController };
