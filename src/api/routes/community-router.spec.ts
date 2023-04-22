import { fastify } from '../../app.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { setupTestsEnd, setupTestsStart } from '../config/setup-tests.js';
import { City, Community, Province } from '@prisma/client';
import { prisma } from '../config/prisma-connect.js';

let token: string;

beforeAll(async () => {
  const { authorization } = await setupTestsStart();
  token = authorization;
});

afterAll(async () => {
  await setupTestsEnd();
});

describe('Community Router', async () => {
  let province: Province;
  let city: City;
  let community: Community;

  it('Deve criar uma província', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'British Columbia',
      short_name: 'BC'
    });
    province = response.body;
    expect(response.status).toBe(201);
  });

  it('Deve criar uma cidade', async () => {
    const response = await request(fastify.server)
      .post('/a/cities')
      .send({
        name: 'Vancouver',
        province_id: province.id
      })
      .set('Authorization', token);
    city = response.body;
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Vancouver');
    expect(response.body.province_id).toBe(province.id);
  });

  /// Community Tests

  it('Deve criar uma comunidade', async () => {
    const response = await request(fastify.server).post('/a/communities').set('Authorization', token).send({
      name: 'Kitsilano',
      city_id: city.id
    });
    community = response.body;
    expect(response.status).toBe(201);
  });

  it('Deve editar informações de uma comunidade', async () => {
    const response = await request(fastify.server).put(`/a/communities/${community.id}`).set('Authorization', token).send({
      name: 'Kits'
    });
    expect(response.status).toBe(202);
    expect(response.body.name).toBe('Kits');
  });

  it('Deve excluir uma comunidade', async () => {
    const response = await request(fastify.server).delete(`/a/communities/${community.id}`).set('Authorization', token);
    console.log(response.body);
    expect(response.status).toBe(202);
  });

  it('Deve excluir uma cidade', async () => {
    const response = await request(fastify.server).delete(`/a/cities/${city.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });

  it('Deve excluir uma província', async () => {
    const response = await request(fastify.server).delete(`/a/provinces/${province.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
    await prisma.$executeRaw`DELETE FROM communities;`;
    await prisma.$executeRaw`DELETE FROM cities;`;
    await prisma.$executeRaw`DELETE FROM provinces;`;
  });
});
