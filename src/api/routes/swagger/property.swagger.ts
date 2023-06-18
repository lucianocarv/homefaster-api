import { FastifySchema } from 'fastify';

const schema = {
  properties_id_image: {
    summary: 'Retorna um array de URLs das imagens da propriedade informada',
    tags: ['Properties'],
    params: {
      id: { type: 'number' }
    }
  } as FastifySchema,
  properties_id: {
    summary: 'Retorna os dados da propriedade informada',
    tags: ['Properties'],
    params: {
      id: { type: 'number' }
    }
  } as FastifySchema,
  properties: {
    summary: 'Retorna várias propriedades podendo ser filtradas conforme endereço e descrição',
    tags: ['Properties'],
    body: {
      type: 'object',
      properties: {
        province: { type: 'string' },
        city: { type: 'string' },
        community: { type: 'string' },
        price_min: { type: 'number' },
        price_max: { type: 'number' },
        badrooms: { type: 'number' },
        bathrooms: { type: 'string' },
        furnished: { type: 'boolean' },
        property_area: { type: 'number' },
        pets_cats: { type: 'number' },
        pets_dogs: { type: 'number' },
        smoking: { type: 'boolean' },
        type_id: { type: 'number' }
      }
    }
  } as FastifySchema,
  properties_create: {
    tags: ['Properties'],
    summary: 'Lista uma nova propriedade no sistema',
    body: {
      type: 'object',
      properties: {
        description: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            price: { type: 'number' },
            bathrooms: { type: 'number' },
            badrooms: { type: 'number' },
            furnished: { type: 'boolean' },
            property_area: { type: 'number' },
            pets_cats: { type: 'number' },
            pets_dogs: { type: 'number' },
            smoking: { type: 'boolean' },
            type_id: { type: 'number' }
          }
        },
        address: {
          type: 'object',
          properties: {
            city: { type: 'string' },
            community: { type: 'string' },
            formatted_address: { type: 'string' },
            number: { type: 'number' },
            street: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            place_id: { type: 'string' },
            postal_code: { type: 'string' },
            province: { type: 'string' }
          }
        },
        utilities: {
          type: 'array',
          items: { type: 'number' }
        },
        features: { type: 'array', items: { type: 'number' } }
      }
    }
  } as FastifySchema,
  property_image_upload: {
    tags: ['Properties'],
    summary: 'Realiza o upload de uma imagem para a propriedade informada',
    body: {
      type: 'object',
      properties: {
        file: { type: 'object' }
      }
    }
  } as FastifySchema,
  property_image_delete: {
    tags: ['Properties'],
    summary: 'Exclui uma imagem da propriedade',
    params: {
      id: {
        type: 'number'
      }
    },
    querystring: {
      image_id: { type: 'number' }
    }
  } as FastifySchema,

  property_update: {
    tags: ['Properties'],
    summary: 'Atualiza informações de uma propriedade',
    params: {
      id: {
        type: 'number'
      }
    },
    body: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        price: { type: 'number' },
        bathrooms: { type: 'number' },
        badrooms: { type: 'number' },
        furnished: { type: 'boolean' },
        property_area: { type: 'number' },
        pets_cats: { type: 'number' },
        pets_dogs: { type: 'number' },
        smoking: { type: 'boolean' }
      }
    }
  } as FastifySchema,

  property_delete: {
    tags: ['Properties'],
    summary: 'Exclui uma  propriedade',
    params: {
      id: {
        type: 'number'
      }
    }
  } as FastifySchema
};

export default schema;
