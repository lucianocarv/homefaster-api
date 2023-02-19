export interface IFilter {
  price_min?: number;
  price_max?: number;
  bathrooms?: number;
  badrooms?: number;
  furnished?: boolean;
  min_property_area?: number;
  max_property_area?: number;
  pets_cats?: number;
  pets_dogs?: number;
  smoking?: boolean;
  type?: string;
  order?: string;
}
