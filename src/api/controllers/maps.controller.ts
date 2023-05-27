import { FastifyReply, FastifyRequest } from 'fastify';
import { GeocodeAPI } from '../services/maps/geocode.services';
import { VMAPSAddress, ValidateAddressAPI } from '../services/maps/validate-address.services';

const gmaps = new GeocodeAPI();
const vmaps = new ValidateAddressAPI();

const mapsController = {
  async getAddress(req: FastifyRequest, res: FastifyReply) {
    const { lat, lng } = req.query as { lat: string; lng: string };
    try {
      const address = await gmaps.getAddress(Number(lat), Number(lng));
      return res.send(address);
    } catch (error) {
      return res.send(error);
    }
  },

  async validateAddress(req: FastifyRequest, res: FastifyReply) {
    const data = req.body as VMAPSAddress;
    try {
      const address = await vmaps.validateAddress(data);
      return res.send(address);
    } catch (error) {
      return res.send(error);
    }
  }
};

export { mapsController };
