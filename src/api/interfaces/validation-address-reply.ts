export interface IValidationAddressReply {
  postal_code?: string;
  latitude: number;
  longitude: number;
  global_code: string;
  place_id?: string;
  formatted_address: string;
}
