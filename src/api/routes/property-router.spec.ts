import { fastify } from '../../app.js';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { setupTestsEnd, setupTestsStart } from '../config/setup-tests.js';
import { City, Community, Property, Province } from '@prisma/client';
import { prisma } from '../config/prisma-connect.js';

let token: string;

beforeAll(async () => {
  const { authorization } = await setupTestsStart();
  token = authorization;
});

afterAll(async () => {
  await setupTestsEnd();
});

describe('Property Routes', async () => {
  let province: Province;
  let city: City;
  let community: Community;
  let property: Property;

  it('Deve criar uma província', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Manitoba',
      short_name: 'MB'
    });
    province = response.body;
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Manitoba');
  });

  it('Deve criar uma cidade', async () => {
    const response = await request(fastify.server)
      .post('/a/cities')
      .send({
        name: 'Winnipeg',
        province_id: province.id
      })
      .set('Authorization', token);
    city = response.body;
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Winnipeg');
    expect(response.body.province_id).toBe(province.id);
  });
  it('Deve criar uma comunidade', async () => {
    const response = await request(fastify.server).post('/a/communities').set('Authorization', token).send({
      name: 'River Heights',
      city_id: city.id
    });
    community = response.body;
    expect(response.status).toBe(201);
  });

  let features: number[];

  it('Deve criar 3 features', async () => {
    const [feature1, feature2, feature3] = await Promise.all([
      request(fastify.server).post('/a/features').set('Authorization', token).send({
        name: 'Tennis Courts',
        type: 'Community'
      }),
      request(fastify.server).post('/a/features').set('Authorization', token).send({
        name: 'Air Conditioning',
        type: 'Property'
      }),
      request(fastify.server).post('/a/features').set('Authorization', token).send({
        name: 'Fitness Area',
        type: 'Building'
      })
    ]);
    features = [feature1.body.id, feature2.body.id, feature3.body.id];
    expect(feature1.status == 201 && feature2.status == 201 && feature3.status == 201).toBe(true);
    expect(feature1.body.name).toBe('Tennis Courts');
    expect(feature2.body.name).toBe('Air Conditioning');
    expect(feature3.body.name).toBe('Fitness Area');
  });

  let utilities: number[];

  it('Deve criar 3 utilities', async () => {
    const [utility1, utility2, utility3] = await Promise.all([
      request(fastify.server).post('/a/utilities').set('Authorization', token).send({
        name: 'Heat'
      }),
      request(fastify.server).post('/a/utilities').set('Authorization', token).send({
        name: 'Water'
      }),
      request(fastify.server).post('/a/utilities').set('Authorization', token).send({
        name: 'Internet'
      })
    ]);
    utilities = [utility1.body.id, utility2.body.id, utility3.body.id];
    expect(utility1.status == 201 && utility2.status == 201 && utility3.status == 201).toBe(true);
    expect(utility1.body.name).toBe('Heat');
    expect(utility2.body.name).toBe('Water');
    expect(utility3.body.name).toBe('Internet');
  });

  // it("Deve criar 2 tipos de propriedade", async() => {
  //   const[type1, type2] = await Promise.all([
  //     request(fastify.server).post("/a/types")
  //   ])
  // })

  // Property Tests

  it('Deve criar uma propriedade', async () => {
    const response = await request(fastify.server)
      .post('/a/properties')
      .set('Authorization', token)
      .send({
        property: {
          community_id: community.id
        },
        address: {
          number: 436,
          street: 'Cordova St'
        },
        description: {
          title: 'Title for other property in Winnipeg',
          price: 3400,
          bathrooms: 1,
          badrooms: 2,
          furnished: true,
          property_area: 10,
          pets_cats: 0,
          pets_dogs: 0,
          smoking: false,
          type_id: 2
        },
        utilities: [utilities],
        features: [features]
      });
    property = response.body;
    expect(response.status).toBe(201);
  });

  it('Deve excluir uma propriedade', async () => {
    const response = await request(fastify.server).delete(`/a/properties/${property.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });

  it('Deve excluir as 3 features', async () => {
    features.forEach(async feature => {
      const response = await request(fastify.server).delete(`/a/features/${feature}`).set('Authorization', token);
      expect(response.status).toBe(202);
    });
  });

  it('Deve excluir as 3 utilidades', async () => {
    utilities.forEach(async utility => {
      const response = await request(fastify.server).delete(`/a/utilities/${utility}`).set('Authorization', token);
      expect(response.status).toBe(202);
    });
  });

  it('Deve excluir uma comunidade', async () => {
    const response = await request(fastify.server).delete(`/a/communities/${community.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });

  it('Deve excluir uma cidade', async () => {
    const response = await request(fastify.server).delete(`/a/cities/${city.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });
  it('Deve criar uma província', async () => {
    const response = await request(fastify.server).delete(`/a/provinces/${province.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });
});
