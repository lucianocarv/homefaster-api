import { FastifyReply, FastifyRequest } from 'fastify';
import { cityServices } from '../services/city.services';
import { GeocodeAPI } from '../services/maps/geocode.services';

const maps = new GeocodeAPI();

const cityController = {
  getFeaturedCities: async (req: FastifyRequest, res: FastifyReply) => {
    const { q } = req.query as { q: string };
    try {
      const cities = await cityServices.getFeaturedCities(Number(q));
      return res.send(cities);
    } catch (error) {
      return res.send(error);
    }
  },

  cityList: async (req: FastifyRequest, res: FastifyReply) => {
    const { name: possibleCity } = req.query as { name: string };
    try {
      const cities = await cityServices.cityList(possibleCity);
      return res.send(cities);
    } catch (error) {
      return res.send(error);
    }
  },

  cityCenter: async (req: FastifyRequest, res: FastifyReply) => {
    const { province, city } = req.query as { province: string; city: string };
    try {
      const coordenates = await maps.getCityCenter(province, city);
      return res.send(coordenates);
    } catch (error) {
      return res.send(error);
    }
  }
};

export { cityController };
