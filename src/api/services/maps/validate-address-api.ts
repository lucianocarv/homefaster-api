import axios from 'axios';
import { env_gmapsApiKey, env_gmapsValidateAddressApiUrl } from '../../../environment';

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
      const URL = `${env_gmapsValidateAddressApiUrl}?key=${env_gmapsApiKey}`;
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
