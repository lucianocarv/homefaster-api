import { Province } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { citiesServices } from '../services/city-services';
import { City } from '../types/city';

const cityController = {
  index: async (req: FastifyRequest, res: FastifyReply) => {
    const { page, perPage } = req.query as { page: string; perPage: string };
    try {
      const provinces = await citiesServices.index(page, perPage);
      res.send(provinces);
    } catch (error) {
      res.send(error);
    }
  },

  create: async (req: FastifyRequest, res: FastifyReply) => {
    const attributes = req.body as City;
    try {
      const province = await citiesServices.create(attributes);
      res.send(province);
    } catch (error) {
      res.send(error);
    }
  },
};

export { cityController };
