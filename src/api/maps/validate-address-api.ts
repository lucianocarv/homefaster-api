import axios from 'axios';
import { FastifyError } from 'fastify';
import { IValidationAddressReply } from '../interfaces/validation-address-reply';
import { env_gmapsApiKey, env_gmapsValidateAddressApiUrl } from '../../environment';

interface IProps {
  province: string;
  city: string;
  address?: string;
  community?: string;
}

export class ValidateAddressAPI {
  static async validatePropertyAddress({
    province,
    city,
    address,
    community,
  }: IProps): Promise<IValidationAddressReply | FastifyError> {
    const body = {
      address: {
        administrativeArea: province,
        locality: city,
        sublocality: community,
        addressLines: [`${address}`],
      },
    };
    try {
      const res = await axios.post(`${env_gmapsValidateAddressApiUrl}?key=${env_gmapsApiKey}`, body);
      const data = await res.data;
      const postal_code = data.result.address.postalAddress.postalCode;
      const formatted_address = data.result.address.formattedAddress;
      const addressComponents = data.result.address.addressComponents as Array<{ confirmationLevel: string }>;
      const geocode = data.result.geocode.location;
      const global_code = data.result.geocode.plusCode.globalCode;
      const place_id = data.result.geocode.placeId;
      const metadata = data.result.metadata;
      const validateAddress = addressComponents.map((component) => component.confirmationLevel);
      const confirmed = validateAddress.find((address) => address !== 'CONFIRMED') == undefined ? true : false;

      if (confirmed && metadata.residential && formatted_address && global_code && geocode && place_id) {
        return {
          postal_code,
          latitude: geocode.latitude,
          longitude: geocode.longitude,
          global_code,
          place_id,
          formatted_address,
        };
      } else {
        throw new Error();
      }
    } catch (error) {
      return error as FastifyError;
    }
  }

  static async getDataForCommunity({ province, city, community }: IProps): Promise<IValidationAddressReply | string> {
    const body = {
      address: { administrativeArea: province, locality: city, addressLines: [`${community}`] },
    };
    const res = await axios.post(`${env_gmapsValidateAddressApiUrl}?key=${env_gmapsApiKey}`, body);
    const data = await res.data;
    const formatted_address = data.result.address.formattedAddress;
    const addressComponents = data.result.address.addressComponents as Array<{ confirmationLevel: string }>;
    const geocode = data.result.geocode.location;
    const global_code = data.result.geocode.plusCode.globalCode;
    const validateAddress = addressComponents.map((component) => component.confirmationLevel);
    const confirmed = validateAddress.find((address) => address !== 'CONFIRMED') == undefined ? true : false;

    if (confirmed) {
      return {
        latitude: geocode.latitude,
        longitude: geocode.longitude,
        global_code,
        formatted_address,
      };
    }
    throw { code: '_', message: 'Comunidade inválida!', statusCode: 422 };
  }
}
