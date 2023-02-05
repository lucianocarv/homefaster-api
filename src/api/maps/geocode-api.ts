import axios from 'axios';

const API_URL = process.env.GMAPS_GEOCODE_API_URL;
const API_KEY = process.env.GMAPS_API_KEY;

export interface IReplyOfGeocodeAPI {
  latitude: number;
  longitude: number;
  place_id: string;
}

export class GeocodeAPI {
  static async getDataForCity(province_short_name: string, city: string): Promise<IReplyOfGeocodeAPI | string> {
    const address = `Canada%20${province_short_name}%20${city}`;
    const res = await axios.get(`${API_URL}?address=${address}&key=${API_KEY}`);
    const data = res.data;
    const formatted_address = data.results[0].formatted_address;
    const { lat: latitude, lng: longitude } = data.results[0].geometry.location;
    const place_id = data.results[0].place_id;
    if (formatted_address.split(',').length == 3) {
      return { latitude, longitude, place_id };
    }
    return 'Invalid City Address';
  }
}
