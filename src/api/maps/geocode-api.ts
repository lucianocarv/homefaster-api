import axios from 'axios';
import { env_gmapsApiKey, env_gmapsGeocodeApiUrl } from '../../environment';
import { IGeocodingAPIReply } from '../interfaces/geocoding-reply';
import { CustomError } from '../helpers/custom-error';

export class GeocodingAPI {
  static async getDataForCity(province_short_name: string, city: string): Promise<IGeocodingAPIReply | string> {
    const address = `${city}&components=administrative_area:${province_short_name}|country:CA`;
    const res = await axios.get(`${env_gmapsGeocodeApiUrl}?address=${address}&key=${env_gmapsApiKey}`);
    const data = res.data;
    if (data.results.length == 0) return 'A cidade inserida pertence à outra província ou é inválida!';
    const formatted_address = data.results[0].formatted_address;
    const name = data.results[0].address_components[0].long_name;
    const { lat: latitude, lng: longitude } = data.results[0].geometry.location;
    const place_id = data.results[0].place_id;
    if (formatted_address.split(',').length == 3) {
      console.log(name);
      return { name, latitude, longitude, place_id };
    }
    throw CustomError('_', `Não existe uma cidade em ${province_short_name} com o nome de ${city}!`, 400);
  }
}
