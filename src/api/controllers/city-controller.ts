import { City } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomError } from '../helpers/custom-error';
import { getPagination } from '../helpers/get-pagination';
import { citiesServices } from '../services/city-services';
import { PaginationParameters } from '../types/pagination-parameters';

const cityController = {
  index: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, per_page } = req.query as { page: string; per_page: string };
    const { page_number, per_page_number, skip } = getPagination(page, per_page) as PaginationParameters;
    try {
      const cities = await citiesServices.index({ page_number, per_page_number, skip });
      res.send(cities);
    } catch (error) {
      res.send(error);
    }
  },

  create: async (req: FastifyRequest, res: FastifyReply) => {
    const attributes = req.body as City;
    try {
      const city = await citiesServices.create(attributes);
      res.send(city);
    } catch (error) {
      res.send(error);
    }
  },

  update: async (req: FastifyRequest, res: FastifyReply) => {
    const params = req.params as { id: string };
    const id = Number(params.id);
    const attributes = req.body as City;
    try {
      const city = await citiesServices.update({ id, attributes });
      res.send(city);
    } catch (error) {
      res.send(error);
    }
  },

  uploadCoverImage: async (req: FastifyRequest, res: FastifyReply) => {
    const data = await req.file();
    const { id } = req.params as { id: string };
    if (!data?.filename) return CustomError('_', 'É necessário incluir um arquivo para realizar o upload!', 406);
    if (!id) return CustomError('_', 'É necessário informar uma propriedade!', 406);
    try {
      const upload = await citiesServices.uploadCoverImage(data, 'cities', Number(id));
      return upload;
    } catch (error) {
      return res.send(error);
    }
  },

  delete: async (req: FastifyRequest, res: FastifyReply) => {
    const params = req.params as { id: string };
    const id = Number(params.id);
    try {
      const city = await citiesServices.delete({ id });
      res.send(city);
    } catch (error) {
      res.send(error);
    }
  },
};

export { cityController };
