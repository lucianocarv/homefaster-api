export interface CreateProperty {
  property: {
    community_id: number;
    manager_id: number;
  };
  address: {
    number: number;
    street: string;
    postal_code: string | null;
    formatted_address: string | null;
    global_code: string | null;
    place_id: string | null;
  };
  property_info: {
    price: number;
    bathrooms: number;
    badrooms: number;
    furnished: boolean;
    property_area: number;
    type_id: number;
  };
  utilities: Array<number>;
  features: Array<number>;
}
