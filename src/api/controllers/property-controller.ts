import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error';
import { getPagination } from '../helpers/get-pagination';
import { ICustomError } from '../interfaces/custom-error';
import { IAddressFilter } from '../interfaces/search-address';
import { IDescriptionFilter } from '../interfaces/search-filter';
import { propertyServices } from '../services/property-services';
import { Address, Description, Property } from '@prisma/client';
import { ERR_MISSING_ATTRIBUTE } from '../errors';
import { ERR_PERMISSION_DENIED } from '../errors/permission-erros';
import { ERR_MISSING_FILE } from '../errors/upload-file-errors';
import { AddressModel, DescriptionModel, PropertyModel } from '../../../prisma/models';
import { getIssuesZod } from '../helpers/get-issues-zod';
import { ICompleteProperty } from '../interfaces/complete-property';

const propertyController = {
  getAllProperties: async (req: FastifyRequest, res: FastifyReply): Promise<Object | FastifyError> => {
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
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const property = await propertyServices.getOneProperty(id);
      return res.send(property);
    } catch (error) {
      return res.send(error);
    }
  },

  createOneProperty: async (req: FastifyRequest, res: FastifyReply): Promise<Property | FastifyError> => {
    const user = req.user as { id: number; role: string };
    const attributes = req.body as {
      property: Property;
      description: Description;
      address: Address;
      utilities: number[];
      features: number[];
    };
    attributes.property.user_id = user.id;
    const parseProperty = PropertyModel.partial({ city_id: true, id: true, created_at: true, updated_at: true }).safeParse(
      attributes.property
    );
    const parseAddress = AddressModel.pick({ number: true, street: true }).safeParse(attributes.address);
    const parseDescription = DescriptionModel.partial({
      id: true,
      property_id: true,
      rented: true,
      created_at: true,
      updated_at: true,
    }).safeParse(attributes.description);

    if (!parseProperty.success) {
      const messages = getIssuesZod(parseProperty.error.issues);
      throw CustomError('_', messages.toString(), 400);
    } else if (!parseAddress.success) {
      const messages = getIssuesZod(parseAddress.error.issues);
      throw CustomError('_', messages.toString(), 400);
    } else if (!parseDescription.success) {
      const messages = getIssuesZod(parseDescription.error.issues);
      throw CustomError('_', messages.toString(), 400);
    }

    const property = {
      property: parseProperty.data,
      address: parseAddress.data,
      description: parseDescription.data,
      utilities: attributes.utilities,
      features: attributes.features,
    };

    try {
      const result = await propertyServices.createOneProperty(property, user.id);
      return res.status(201).send(result);
    } catch (error) {
      return res.send(error);
    }
  },

  updateOneProperty: async (req: FastifyRequest, res: FastifyReply): Promise<Property | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role == 'User') throw ERR_PERMISSION_DENIED;
    const { id } = req.params as { id: string };
    const attributes = req.body as ICompleteProperty;
    try {
      const property = await propertyServices.updateOneProperty(Number(id), attributes);
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
        address,
      });
      return res.send(properties);
    } catch (error) {
      return res.send(error);
    }
  },

  uploadThumbImage: async (req: FastifyRequest, res: FastifyReply): Promise<{ message: string } | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role == 'User') throw ERR_PERMISSION_DENIED;
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.file) throw ERR_MISSING_FILE;
    if (!id) throw ERR_MISSING_ATTRIBUTE('property_id');
    try {
      const result = await propertyServices.uploadThumbImage(data, Number(id));
      return res.status(202).send(result);
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
  },
};

export { propertyController };
