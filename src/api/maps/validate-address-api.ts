import axios from 'axios';

const API_URL = process.env.GMAPS_VALIDATE_ADDRESS_API_URL;
const API_KEY = process.env.GMAPS_API_KEY;

interface IPropsOfPropertyAddress {
  province: string;
  city: string;
  address: string;
  community?: string;
}
interface IPropsOfCommunityAddress {
  province: string;
  city: string;
  community: string;
}

export interface IReplyOfValidateAddressAPI {
  postal_code?: string;
  latitude: number;
  longitude: number;
  global_code: string;
  place_id?: string;
  formatted_address: string;
}

export interface IReplyOfValidateAddressAPIProperty {
  postal_code: string;
  latitude: number;
  longitude: number;
  global_code: string;
  place_id: string;
  formatted_address: string;
}

export class ValidateAddressAPI {
  static async getDataForProperty({
    province,
    city,
    address,
    community,
  }: IPropsOfPropertyAddress): Promise<IReplyOfValidateAddressAPIProperty | string> {
    const body = {
      address: {
        administrativeArea: province,
        locality: city,
        sublocality: community,
        addressLines: [`${address}`],
      },
    };
    const res = await axios.post(`${API_URL}?key=${API_KEY}`, body);
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

    if (confirmed && metadata.residential) {
      return {
        postal_code,
        latitude: geocode.latitude,
        longitude: geocode.longitude,
        global_code,
        place_id,
        formatted_address,
      };
    }
    return 'Invalid Address';
  }

  static async getDataForCommunity({
    province,
    city,
    community,
  }: IPropsOfCommunityAddress): Promise<IReplyOfValidateAddressAPI | string> {
    const body = {
      address: { administrativeArea: province, locality: city, addressLines: [`${community}`] },
    };
    const res = await axios.post(`${API_URL}?key=${API_KEY}`, body);
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
    return 'Invalid Community';
  }
}
