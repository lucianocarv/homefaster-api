import { City } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error';
import { getPagination } from '../helpers/get-pagination';
import { ICustomError } from '../interfaces/custom-error';
import { citiesServices } from '../services/city-services';
import { PaginationParameters } from '../interfaces/pagination-parameters';

const cityController = {
  index: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    try {
      const cities = await citiesServices.getAllCities({ page_number, per_page_number, skip });
      res.send(cities);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  city: async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: string };
    try {
      const city = await citiesServices.getOneCity(Number(id));
      return city;
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
    const { role } = req.user as { role: string };
    if (role !== 'Admin')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador para acessar este recurso!',
        statusCode: 401,
      };
    const attributes = req.body as City;
    console.log('F(OI ATEASDOFOA');
    try {
      const city = await citiesServices.createOneCity(attributes);
      res.send(city);
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
    if (role !== 'Admin')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador para acessar este recurso!',
        statusCode: 401,
      };
    const params = req.params as { id: string };
    const id = Number(params.id);
    const attributes = req.body as City;
    try {
      if (!attributes) throw { code: '_', message: 'Insira pelo menos um atributo a ser atualizado!', statusCode: 422 };
      const city = await citiesServices.updateOneCity({ id, attributes });
      return res.send(city);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  uploadCoverImage: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador para acessar este recurso!',
        statusCode: 401,
      };
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.filename) throw { code: '_', message: 'É necessário incluir um arquivo para realizar o upload!', statusCode: 422 };
    if (!id) throw { code: '_', message: 'É necessário informar uma propriedade!', statusCode: 422 };
    try {
      const uploaded = await citiesServices.uploadCoverImage(data, 'cities', Number(id));
      return res.send(uploaded);
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
    if (role !== 'Admin')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador para acessar este recurso!',
        statusCode: 401,
      };
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const city = await citiesServices.deleteOneCity({ id });
      return res.send(city);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },
};

export { cityController };
