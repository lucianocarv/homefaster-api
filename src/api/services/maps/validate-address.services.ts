import axios from 'axios';
import { GMAPS_API_KEY, GMAPS_VALIDATE_ADDRESS_API_URL } from '../../../config/environment';

export interface VMAPSAddress {
  province: string;
  city: string;
  community: string;
}

interface VMAPSAddressComponents {
  componentName: {
    text: string;
    languageCode: string;
  };
  componentType: string;
  confirmationLevel: string;
}

interface ValidateAddressResponse {
  result: {
    address: {
      addressComponents: VMAPSAddressComponents[];
    };
  };
}

export class ValidateAddressAPI {
  async validateAddress(data: VMAPSAddress) {
    try {
      const URL = `${GMAPS_VALIDATE_ADDRESS_API_URL}?key=${GMAPS_API_KEY}`;
      const response: ValidateAddressResponse = await axios
        .post(URL, {
          address: {
            administrativeArea: data.province,
            locality: data.city,
            addressLines: [data.community]
          }
        })
        .then(res => res.data);

      const validate = response.result.address.addressComponents.find(a => a.confirmationLevel !== 'CONFIRMED');
      if (validate) {
        return validate;
      } else {
        return true;
      }
    } catch (error) {
      return error;
    }
  }
}
