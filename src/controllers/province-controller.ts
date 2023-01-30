import { Province } from '@prisma/client';
import { FastifyError, FastifyReply, FastifyRequest, RequestParamsDefault } from 'fastify';
import { provinceServices } from '../services/province-services.js';

const provinceController = {
  index: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const provinces = await provinceServices.index();
      res.send(provinces);
    } catch (error) {
      res.send(error);
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
};

export { provinceController };
