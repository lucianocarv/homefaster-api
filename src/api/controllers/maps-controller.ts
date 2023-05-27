import { FastifyReply, FastifyRequest } from 'fastify';
import { GeocodeAPI } from '../services/maps/geocode.services';
import { VMAPSAddress, ValidateAddressAPI } from '../services/maps/validate-address.services';

const gmaps = new GeocodeAPI();
const vmaps = new ValidateAddressAPI();

const mapsController = {
  async getAddress(req: FastifyRequest, res: FastifyReply) {
    const { lat, lng } = req.query as { lat: string; lng: string };
    try {
      console.log(lat, lng);
      const response = await gmaps.getDataByLocation(Number(lat), Number(lng));
      const address_components = gmaps.getFirstResultAndValidate(response);
      if (address_components !== undefined) {
        const validate = gmaps.validateAddressComponents(address_components);
        if (validate !== undefined) {
          const address = gmaps.makeAddressForProperty(validate);
          return res.send(address);
        }
      }
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
