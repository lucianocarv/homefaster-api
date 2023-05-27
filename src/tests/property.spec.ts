import { expect, it, describe, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

import { fastify } from '../app';
import { prisma } from '../api/config/prisma/prisma.config';
import { propertyServices } from '../api/services/property.services';
import { GeocodeAPI } from '../api/services/maps/geocode.services';
import { Property, Type } from '@prisma/client';

let token: string;

beforeAll(async () => {
  await fastify.listen();
  await prisma.$connect();
  const login = await request(fastify.server).post('/users/login').send({
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD
  });
  token = login.body.token;
});

afterAll(async () => {
  await fastify.close();
  await prisma.$disconnect();
});

describe('property.routes.ts', async () => {
  const geocode = new GeocodeAPI();
  let property: Property;
  let type: Type;

  it('POST /a/types - Cria um tipo', async () => {
    const response = await request(fastify.server).post('/a/types').set('Authorization', token).send({
      name: 'House'
    });
    type = response.body;
    expect(response.status).toBe(201);
  });

  it('POST /a/properties - Deve criar uma propriedade', async () => {
    const mapsData = await geocode.getAddress(51.02178640656934, -114.17961175764125);
    const body = {
      description: {
        title: 'Uma ótima propriedade Signal Hill',
        price: 3500,
        bathrooms: 3,
        badrooms: 2,
        furnished: false,
        property_area: 100,
        pets_cats: 0,
        pets_dogs: 0,
        smoking: false,
        type_id: type.id
      },
      address: mapsData,
      features: [],
      utilities: []
    };
    const response = await request(fastify.server).post('/a/properties').set('Authorization', token).send(body);
    property = response.body;
    expect(response.status).toBe(201);
    expect(response.body.description.price).toBe(body.description.price);
  });

  it('Exclui properiedade', async () => {
    const response = await request(fastify.server).delete(`/a/properties/${property.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });

  it('Exclui um tipo de propriedade', async () => {
    const response = await request(fastify.server).delete(`/a/types/${type.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });
});
