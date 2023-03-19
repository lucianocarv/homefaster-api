import { Province } from '@prisma/client';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error.js';
import { getPagination } from '../helpers/get-pagination.js';
import { ICustomError } from '../interfaces/custom-error.js';
import { provinceServices } from '../services/province-services.js';
import { PaginationParameters } from '../interfaces/pagination-parameters.js';
import { ERR_MISSING_FILE, ERR_MISSING_UPDATE_ATTRIBUTES, ERR_PERMISSION_DENIED } from '../errors/index.js';

const provinceController = {
  getAllProvinces: async (req: FastifyRequest, res: FastifyReply): Promise<Province[] | FastifyError> => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    try {
      const provinces = await provinceServices.getAllProvinces({ page_number, per_page_number, skip });
      return res.send(provinces);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  getOneProvince: async (req: FastifyRequest, res: FastifyReply): Promise<Province | FastifyError> => {
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

  createOneProvince: async (req: FastifyRequest, res: FastifyReply): Promise<Province | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const attributes = req.body as Province;
    try {
      const province = await provinceServices.createOneProvince(attributes);
      return res.status(201).send(province);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  updateOneProvince: async (req: FastifyRequest, res: FastifyReply): Promise<Province> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const params = req.params as { id: string };
    const id = Number(params.id);
    const attributes = req.body as Province;
    if (!attributes) throw ERR_MISSING_UPDATE_ATTRIBUTES;
    try {
      const province = await provinceServices.updateOneProvince({ id, attibutes: attributes });
      return res.status(202).send(province);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  uploadImageForProvince: async (req: FastifyRequest, res: FastifyReply): Promise<{ message: string } | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.file) throw ERR_MISSING_FILE;
    try {
      const upload = await provinceServices.uploadImgCover(data, 'provinces', Number(id));
      return res.status(202).send(upload);
    } catch (error) {
      const err = error as ICustomError;
      if (err.code) {
        return res.send(CustomError(err.code, err.message, err.statusCode));
      } else {
        return res.send(error);
      }
    }
  },

  delete: async (req: FastifyRequest, res: FastifyReply): Promise<{ message: string } | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const province = await provinceServices.deleteOneProvince({ id });
      return res.status(202).send(province);
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
