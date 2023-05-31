import { FastifySchema } from 'fastify';

const schema = {
  properties_id_image: {
    summary: 'Retorna as imagens da propriedade informada',
    tags: ['properties']
  } as FastifySchema,
  properties_id: {
    summary: 'Retorna a propriedade informada',
    tags: ['properties']
  } as FastifySchema,
  properties: {
    summary: 'Retorna todas as propriedades',
    tags: ['properties']
  } as FastifySchema
};

export default schema;
