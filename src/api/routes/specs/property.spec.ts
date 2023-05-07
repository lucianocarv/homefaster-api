import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fastify } from '../../../app';
import request from 'supertest';
import { env_test_email, env_test_password } from '../../../environment';
import { Type } from '@prisma/client';
import { prisma } from '../../config/prisma-connect';

const req = request(fastify.server);
let token: string;

describe('province-router tests', async () => {
  beforeAll(async () => {
    await fastify.listen();
    const request = await req.post('/users/login').send({ email: env_test_email, password: env_test_password });
    expect(request.body.token).toBeTypeOf('string');
    token = request.body.token;
  });

  afterAll(async () => {
    await prisma.$executeRaw`DELETE FROM properties;`;
    await prisma.$executeRaw`DELETE FROM p_types;`;
    await fastify.close();
  });

  let _type: Type;

  describe('POST /a/types', async () => {
    it('type: should be create a type of property', async () => {
      const type = { name: 'House' };
      const response = await req.post('/a/types').set('Authorization', token).send(type);
      expect(response.body.name).toBe(type.name);
      _type = response.body;
    });
  });

  describe('POST /a/property', async () => {
    it('property: should be create a property', async () => {
      const property = {
        description: {
          title: 'Uma ótima propriedade em Downtown - Bairro Agradável',
          price: 2500,
          bathrooms: 2,
          badrooms: 3,
          furnished: false,
          property_area: 50,
          pets_cats: 1,
          pets_dogs: 1,
          smoking: false,
          type_id: _type.id
        },
        address: {
          city: 'Calgary',
          community: 'Downtown',
          formatted_address: '211 -1711 4 St SW, Calgary, AB T2P 2V6, Canada',
          number: 307,
          street: '4 Street Southwest',
          latitude: 51.049977,
          longitude: -114.0718509,
          place_id: 'ChIJaQ30GftvcVMRD7RT1dIikuU',
          postal_code: 'T2P 2V6',
          province: 'Alberta'
        },
        utilities: [],
        features: []
      };
      const response = await req.post('/a/properties').set('Authorization', token).send(property);
      expect(response.body.id).toBeTypeOf('number');
      expect(response.body.address.city).toBe('Calgary');
      expect(response.body.description.title).toBe(property.description.title);
    });
  });
});
