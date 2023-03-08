export interface PropertyWithAddressAndDescription {
  property: {
    community_id: number;
    manager_id: number;
  };
  address: {
    number: number;
    street: string;
  };
  description: {
    title: string;
    thumb: string;
    price: number;
    bathrooms: number;
    badrooms: number;
    furnished: boolean;
    property_area: number;
    pets_cats: number;
    pets_dogs: number;
    smoking: boolean;
    type_id: number;
  };
  utilities: Array<number>;
  features: Array<number>;
}

export interface PropertyWithAddressAndDescriptionUpdate {
  description: {
    title?: string;
    thumb?: string;
    price?: number;
    bathrooms?: number;
    badrooms?: number;
    furnished?: boolean;
    property_area?: number;
    pets_cats?: number;
    pets_dogs?: number;
    smoking?: boolean;
    type_id?: number;
  };
  utilities?: Array<number>;
  features?: Array<number>;
}
