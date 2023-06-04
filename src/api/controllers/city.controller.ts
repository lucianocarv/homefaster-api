import { FastifyReply, FastifyRequest } from 'fastify';
import { cityServices } from '../services/city.services';

const cityController = {
  getFeaturedCities: async (req: FastifyRequest, res: FastifyReply) => {
    const { q } = req.query as { q: string };
    try {
      const cities = await cityServices.getFeaturedCities(Number(q));
      return res.send(cities);
    } catch (error) {}
  }
};

export { cityController };
