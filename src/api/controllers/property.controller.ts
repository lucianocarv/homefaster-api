import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { getPagination } from '../helpers/get-pagination';
import { IAddressFilter } from '../interfaces/search-address';
import { IDescriptionFilter } from '../interfaces/search-filter';
import { propertyServices } from '../services/property.services';
import { ERR_MISSING_ATTRIBUTE } from '../errors';
import { ERR_PERMISSION_DENIED } from '../errors/permission.errors';
import { ERR_MISSING_FILE } from '../errors/upload.errors';
import { IPropertyUpdateAttributes } from '../interfaces/complete-property';
import { Address, Description, Feature, Property } from '@prisma/client';
import { AddressModel, DescriptionModel } from '../../../prisma/models';
import { CustomError } from '../helpers/custom-error';

const propertyController = {
  getAllProperties: async (req: FastifyRequest, res: FastifyReply): Promise<Property[] | FastifyError> => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);
    try {
      const properties = await propertyServices.getAllProperties({ page_number, per_page_number, skip });
      return res.send(properties);
    } catch (error) {
      return res.send(error);
    }
  },

  getOneProperty: async (req: FastifyRequest, res: FastifyReply): Promise<Property | FastifyError> => {
    const { id } = req.params as { id: string };
    try {
      const property = await propertyServices.getOneProperty(Number(id));
      if (property) {
        return res.send(property);
      } else {
        return res.send(CustomError('_', 'Esta propriedade não existe', 400));
      }
    } catch (error) {
      return res.send(CustomError('_', 'Não foi possível realizar a requisição, verifique se os parêmetros estão corretos', 500));
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
      if (propertyExists) throw CustomError('_', 'Esta propriedade já está cadastrada!', 400);
      const result = await propertyServices.createOneProperty(data, user.id);
      return res.status(201).send(result);
    } catch (error) {
      return res.send(error);
    }
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

  propertyFilter: async (req: FastifyRequest, res: FastifyReply): Promise<Object | FastifyError> => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);
    const { description, address } = req.body as { description: IDescriptionFilter; address: IAddressFilter };
    try {
      const properties = await propertyServices.filter({
        pagination: { page_number, per_page_number, skip },
        description,
        address
      });
      return res.send(properties);
    } catch (error) {
      return res.send(error);
    }
  },

  uploadImage: async (req: FastifyRequest, res: FastifyReply): Promise<{ message: string } | FastifyError> => {
    const data = await req.file();
    const { id: user_id } = req.user as { id: string };
    const { id: property_id } = req.params as { id: string };
    if (!data?.file) throw ERR_MISSING_FILE;
    if (!property_id) throw ERR_MISSING_ATTRIBUTE('property_id');
    try {
      const result = await propertyServices.uploadImage(data, Number(property_id), Number(user_id));
      return res.status(202).send(result);
    } catch (error) {
      return res.send(error);
    }
  },

  getImages: async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    try {
      const images = await propertyServices.getImages(Number(id));
      return res.send(images);
    } catch (error) {
      return res.send(error);
    }
  },

  deleteOneProperty: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role == 'User') throw ERR_PERMISSION_DENIED;
    const { id } = req.params as { id: string };
    try {
      const property = await propertyServices.deleteOneProperty(Number(id));
      return res.status(202).send(property);
    } catch (error) {
      return res.send(error);
    }
  }
};

export { propertyController };
