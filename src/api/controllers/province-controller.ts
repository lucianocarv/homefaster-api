import { Province } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error.js';
import { getPagination } from '../helpers/get-pagination.js';
import { ICustomError } from '../interfaces/custom-error.js';
import { provinceServices } from '../services/province-services.js';
import { PaginationParameters } from '../interfaces/pagination-parameters.js';

const provinceController = {
  index: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    try {
      const provinces = await provinceServices.getAllProvinces({ page_number, per_page_number, skip });
      res.send(provinces);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  province: async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: number };
    try {
      const province = await provinceServices.getOneProvince(Number(id));
      return res.send(province);
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
    const attributes = req.body as Province;
    try {
      const province = await provinceServices.createOneProvince(attributes);
      res.send(province);
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
    const attibutes = req.body as Province;

    try {
      const province = await provinceServices.updateOneProvince({ id, attibutes });
      return province;
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  uploadImgCover: async (req: FastifyRequest, res: FastifyReply) => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin')
      throw {
        code: '_',
        message: 'É necessário acesso de adminsitrador para acessar este recurso!',
        statusCode: 401,
      };
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.file) return res.status(406).send({});
    if (!id) return res.status(406).send({});
    try {
      const upload = await provinceServices.uploadImgCover(data, 'provinces', Number(id));
      return upload;
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
      const province = await provinceServices.deleteOneProvince({ id });
      res.send(province);
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

export { provinceController };
