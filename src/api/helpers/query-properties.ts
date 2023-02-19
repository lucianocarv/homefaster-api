export const _address = {
  id: true,
  number: true,
  street: true,
  formatted_address: true,
  global_code: true,
  postal_code: true,
  place_id: true,
  latitude: true,
  longitude: true,
  city: true,
  community: true,
  province: true,
};

export const _description = {
  id: true,
  title: true,
  thumb: true,
  price: true,
  bathrooms: true,
  badrooms: true,
  furnished: true,
  rented: true,
  property_area: true,
  pets_cats: true,
  pets_dogs: true,
  smoking: true,
  type: {
    select: { name: true },
  },
};

export const _manager = {
  name: true,
  email: true,
  phone: true,
  website: true,
  img_logo: true,
  img_profile: true,
};
