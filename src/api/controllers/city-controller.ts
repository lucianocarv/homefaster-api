import { City } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
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
