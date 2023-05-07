import axios from 'axios';
import { env_gmapsGeocodeApiUrl } from '../../../environment';
import { env_gmapsApiKey } from '../../../environment';
import { Address } from '@prisma/client';

type GeocodeComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

interface Coordenates {
  lat: number;
  lng: number;
}

type GeocodeAddressComponents = {
  number: GeocodeComponent;
  street: GeocodeComponent;
  community: GeocodeComponent;
  city: GeocodeComponent;
  province: GeocodeComponent;
  country: GeocodeComponent;
  postal_code: GeocodeComponent;
  formatted_address: string;
  place_id: string;
  location: Coordenates;
};

interface GeocodeResponse {
  results: [GeocodeAddress];
}

interface GeocodeAddress {
  address_components: [
    {
      long_name: string;
      short_name: string;
      types: string[];
    }
  ];
  formatted_address: string;
  geometry: {
    location_type: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  plus_code: {
    global_code: string;
  };
  types: string[];
}

export class GeocodeAPI {
  async getDataByLocation(lat: number, lng: number): Promise<GeocodeResponse> {
    const URL = `${env_gmapsGeocodeApiUrl}?latlng=${lat},${lng}&location_type=ROOFTOP&key=${env_gmapsApiKey}`;
    const response = await axios.get(URL);
    return response.data as GeocodeResponse;
  }

  getFirstResultAndValidate(response: GeocodeResponse): GeocodeAddress | undefined {
    const address = response.results[0] as GeocodeAddress;
    return address;
  }

  validateAddressComponents(address: GeocodeAddress): GeocodeAddressComponents | undefined {
    const formatted_address = address.formatted_address;
    const place_id = address.place_id;
    const location = address.geometry.location;
    const number = address.address_components.find(component => component.types.includes('street_number')) as GeocodeComponent;
    const street = address.address_components.find(component => component.types.includes('route')) as GeocodeComponent;
    const community = address.address_components.find(component => component.types.includes('neighborhood')) as GeocodeComponent;
    const city = address.address_components.find(component => component.types.includes('locality')) as GeocodeComponent;
    const province = address.address_components.find(component =>
      component.types.includes('administrative_area_level_1')
    ) as GeocodeComponent;
    const country = address.address_components.find(component => component.types.includes('country')) as GeocodeComponent;
    const postal_code = address.address_components.find(component => component.types.includes('postal_code')) as GeocodeComponent;

    if (number && street && community && city && province && country && postal_code) {
      return {
        number,
        street,
        community,
        city,
        province,
        country,
        postal_code,
        formatted_address,
        place_id,
        location
      } as GeocodeAddressComponents;
    }
  }

  makeAddressForProperty(components: GeocodeAddressComponents) {
    const address = {
      city: components.city.long_name,
      community: components.community.long_name,
      formatted_address: components.formatted_address,
      number: Number(components.number.long_name),
      street: components.street.long_name,
      latitude: components.location.lat,
      longitude: components.location.lng,
      place_id: components.place_id,
      postal_code: components.postal_code.long_name,
      province: components.province.long_name
    } as Address;
    return address;
  }
}