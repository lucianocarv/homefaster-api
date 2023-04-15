import { Province } from '@prisma/client';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { getPagination } from '../helpers/get-pagination.js';
import { provinceServices } from '../services/province-services.js';
import { PaginationParameters } from '../interfaces/pagination-parameters.js';
import { ERR_PERMISSION_DENIED } from '../errors/permission-erros.js';
import { ERR_MISSING_FILE } from '../errors/upload-file-errors.js';
import { ProvinceModel } from '../../../prisma/models';
import { CustomError } from '../helpers/custom-error.js';
import { getIssuesZod } from '../helpers/get-issues-zod.js';

const provinceController = {
  getAllProvinces: async (req: FastifyRequest, res: FastifyReply): Promise<Province[] | FastifyError> => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    try {
      const provinces = await provinceServices.getAllProvinces({ page_number, per_page_number, skip });
      return res.send(provinces);
    } catch (error) {
      return res.send(error);
    }
  },

  getOneProvince: async (req: FastifyRequest, res: FastifyReply): Promise<Province | FastifyError> => {
    const { id } = req.params as { id: number };
    try {
      const province = await provinceServices.getOneProvince(Number(id));
      return res.send(province);
    } catch (error) {
      return res.send(error);
    }
  },

  createOneProvince: async (req: FastifyRequest, res: FastifyReply): Promise<Province | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const attributes = req.body as Province;
    const parse = ProvinceModel.partial({ id: true, img_cover: true, updated_at: true, created_at: true }).safeParse(attributes);

    if (!parse.success) {
      const messages = getIssuesZod(parse.error.issues);
      throw CustomError('_', messages.toString(), 400);
    }

    const province = parse.data as Province;

    try {
      const result = await provinceServices.createOneProvince(province);
      return res.status(201).send(result);
    } catch (error) {
      return res.send(error);
    }
  },

  updateOneProvince: async (req: FastifyRequest, res: FastifyReply): Promise<Province | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const params = req.params as { id: string };
    const id = Number(params.id);
    const attributes = req.body;

    const onlyChange = ProvinceModel.pick({ name: true, short_name: true }).partial({ name: true, short_name: true });
    const parse = onlyChange.safeParse(attributes);
    if (!parse.success) {
      const messages = getIssuesZod(parse.error.issues);
      throw CustomError('_', messages.toString(), 400);
    }

    const province = parse.data as Province;

    try {
      const result = await provinceServices.updateOneProvince({ id, attibutes: province });
      return res.status(202).send(result);
    } catch (error) {
      return res.send(error);
    }
  },

  uploadImageForProvince: async (req: FastifyRequest, res: FastifyReply): Promise<{ message: string } | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.filename) throw ERR_MISSING_FILE;
    try {
      const upload = await provinceServices.uploadImgCover(data, Number(id));
      return res.status(202).send(upload);
    } catch (error) {
      return res.send(error);
    }
  },

  deleteOneProvince: async (req: FastifyRequest, res: FastifyReply): Promise<{ message: string } | FastifyError> => {
    const { role } = req.user as { role: string };
    if (role !== 'Admin') throw ERR_PERMISSION_DENIED;
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const province = await provinceServices.deleteOneProvince({ id });
      return res.status(202).send(province);
    } catch (error) {
      return res.send(error);
    }
  },
};

export { provinceController };
