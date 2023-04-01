import { City } from '@prisma/client';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error';
import { getPagination } from '../helpers/get-pagination';
import { ICustomError } from '../interfaces/custom-error';
import { citiesServices } from '../services/city-services';
import { PaginationParameters } from '../interfaces/pagination-parameters';
import { ERR_PERMISSION_DENIED } from '../errors/permission-erros';
import { ERR_MISSING_ATTRIBUTE, ERR_MISSING_ID } from '../errors';
import { ERR_MISSING_FILE, ERR_MISSING_UPDATE_ATTRIBUTES } from '../errors/upload-file-errors';

const cityController = {
  getAllCities: async (req: FastifyRequest, res: FastifyReply): Promise<City[] | FastifyError> => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    try {
      const cities = await citiesServices.getAllCities({ page_number, per_page_number, skip });
      return res.send(cities);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  getOneCity: async (req: FastifyRequest, res: FastifyReply): Promise<City | FastifyError> => {
    const { id } = req.params as { id: string };
    try {
      const city = await citiesServices.getOneCity(Number(id));
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

  createOneCity: async (req: FastifyRequest, res: FastifyReply): Promise<City | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const attributes = req.body as City;
    if (!attributes.name) throw ERR_MISSING_ATTRIBUTE('name');
    if (!attributes.province_id) throw ERR_MISSING_ATTRIBUTE('province_id');
    try {
      const city = await citiesServices.createOneCity(attributes);
      return res.status(201).send(city);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(err);
      } else {
        return res.send(error);
      }
    }
  },

  updateOneCity: async (req: FastifyRequest, res: FastifyReply): Promise<City | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const params = req.params as { id: string };
    const id = Number(params.id);
    const attributes = req.body as City;
    if (!id) throw ERR_MISSING_ID('cidade', 'atualizada');
    if (!attributes) throw ERR_MISSING_UPDATE_ATTRIBUTES;
    try {
      const city = await citiesServices.updateOneCity({ id, attributes });
      return res.status(202).send(city);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  uploadCoverImageForOneCity: async (req: FastifyRequest, res: FastifyReply): Promise<{ message: string } | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.filename) throw ERR_MISSING_FILE;
    if (!id) throw ERR_MISSING_ID('cidade', 'atualizada');
    try {
      const uploaded = await citiesServices.uploadCoverImage(data, Number(id));
      return res.status(202).send(uploaded);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  deleteOneCity: async (req: FastifyRequest, res: FastifyReply): Promise<{ message: string } | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const params = req.params as { id: string };
    const id = Number(params.id);
    if (!id) throw ERR_MISSING_ID('cidade', 'excluída');
    try {
      const city = await citiesServices.deleteOneCity({ id });
      return res.status(202).send(city);
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
