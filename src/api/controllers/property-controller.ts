import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error';
import { getPagination } from '../helpers/get-pagination';
import { ICustomError } from '../interfaces/custom-error';
import { IAddressFilter } from '../interfaces/search-address';
import { IDescriptionFilter } from '../interfaces/search-filter';
import { propertyServices } from '../services/property-services';
import { PropertyWithAddressAndDescription } from '../interfaces/create-property';

const propertyController = {
  index: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page);
    try {
      const properties = await propertyServices.getAllProperties({ page_number, per_page_number, skip });
      return res.send(properties);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  property: async (req: FastifyRequest, res: FastifyReply) => {
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const property = await propertyServices.getOneProperty(id);
      return res.send(property);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  create: async (req: FastifyRequest, res: FastifyReply) => {
    const user = req.user as { id: number; role: string };
    if (user.role == 'User')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador ou proprietário para listar uma propriedade!',
        statusCode: 401,
      };
    const attibutes = req.body as PropertyWithAddressAndDescription;
    try {
      const property = await propertyServices.createOneProperty(attibutes, user.id);
      return res.send(property);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  update: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role == 'User')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador ou gerenciador de propriedades para listar uma propriedade!',
        statusCode: 401,
      };
    const { id } = req.params as { id: string };
    const attributes = req.body as PropertyWithAddressAndDescription;
    console.log(attributes);
    try {
      const property = await propertyServices.updateOneProperty(Number(id), attributes);
      return res.send(property);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  filter: async (req: FastifyRequest, res: FastifyReply) => {
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
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  uploadThumbImage: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role == 'User')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador ou gerenciador de propriedades para listar uma propriedade!',
        statusCode: 401,
      };
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.filename) return CustomError('_', 'É necessário incluir um arquivo para realizar o upload!', 406);
    if (!id) return CustomError('_', 'É necessário informar uma propriedade!', 406);
    try {
      const result = await propertyServices.uploadThumbImage(data, 'properties', Number(id));
      return res.send(result);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  delete: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role == 'User')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador ou gerenciador de propriedades para listar uma propriedade!',
        statusCode: 401,
      };
    const { id } = req.params as { id: string };
    try {
      const property = await propertyServices.deleteOneProperty(Number(id));
      return res.send(property);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        const err = error as ICustomError;
        if (err.code) {
          return res.send(CustomError(err.code, err.message, err.statusCode));
        } else {
          return res.send(error);
        }
      }
    }
  },
};

export { propertyController };
