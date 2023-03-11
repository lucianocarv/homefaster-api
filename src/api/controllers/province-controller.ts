import { Province } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getPagination } from '../helpers/get-pagination.js';
import { provinceServices } from '../services/province-services.js';
import { imageUpload } from '../storage/upload-image.js';
import { PaginationParameters } from '../types/pagination-parameters.js';

const provinceController = {
  index: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    try {
      const provinces = await provinceServices.index({ page_number, per_page_number, skip });
      res.send(provinces);
    } catch (error) {
      res.send(error);
    }
  },

  province: async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as { id: number };
    try {
      const province = await provinceServices.province(Number(id));
      return res.send(province);
    } catch (error) {
      return res.send(error);
    }
  },

  create: async (req: FastifyRequest, res: FastifyReply) => {
    const attributes = req.body as Province;
    try {
      const province = await provinceServices.create(attributes);
      res.send(province);
    } catch (error) {
      res.send(error);
    }
  },

  update: async (req: FastifyRequest, res: FastifyReply) => {
    const params = req.params as { id: string };
    const id = Number(params.id);
    const attibutes = req.body as Province;

    try {
      const province = await provinceServices.update({ id, attibutes });
      return province;
    } catch (error) {
      res.send(error);
    }
  },

  uploadImgCover: async (req: FastifyRequest, res: FastifyReply) => {
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.file) return res.status(406).send({});
    if (!id) return res.status(406).send({});
    try {
      const upload = await provinceServices.uploadImgCover(data, 'provinces', Number(id));
      return upload;
    } catch (error) {}
  },

  delete: async (req: FastifyRequest, res: FastifyReply) => {
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const province = await provinceServices.delete({ id });
      res.send(province);
    } catch (error) {
      res.send(error);
    }
  },
};

export { provinceController };
