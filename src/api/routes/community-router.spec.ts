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

  it('Deve criar uma comunidade padrão', async () => {
    const response = await request(fastify.server).post('/a/communities').set('Authorization', token).send({
      name: 'Kitsilano',
      city_id: city.id
    });
    community = response.body;
    expect(response.status).toBe(201);
  });

  it('Não deve criar uma comunidade sem cidade cadastrada', async () => {
    const response = await request(fastify.server).post('/a/communities').set('Authorization', token).send({
      name: 'Kitsilano',
      city_id: 898998
    });
    expect(response.status).toBe(400);
  });

  it('Deve editar informações de uma comunidade', async () => {
    const response = await request(fastify.server).put(`/a/communities/${community.id}`).set('Authorization', token).send({
      name: 'Kits'
    });
    expect(response.status).toBe(202);
    expect(response.body.name).toBe('Kits');
  });

  it('Não deve editar o nome da comunidade com menos de 3 caracteres', async () => {
    const response = await request(fastify.server).put(`/a/communities/${community.id}`).set('Authorization', token).send({
      name: 'Ki'
    });
    expect(response.status).toBe(400);
  });

  it('Não deve editar o nome de uma comunidade que não existe', async () => {
    const response = await request(fastify.server).put('/a/communities/9090').set('Authorization', token).send({
      name: 'Kitislano'
    });
    expect(response.status).toBe(400);
  });

  it('Não deve criar uma comunidade sem token de autorização', async () => {
    const response = await request(fastify.server).post('/a/communities').send({
      name: 'Varsity',
      city_id: city.id
    });
    expect(response.status).toBe(401);
  });

  it('Não deve criar uma comunidade que não existe', async () => {
    const response = await request(fastify.server).post('/a/communities').set('Authorization', token).send({
      name: 'Calgary',
      city_id: city.id
    });
    expect(response.status).toBe(400);
  });

  it('Não deve criar uma comunidade com o nome menor que 3 caracteres', async () => {
    const response = await request(fastify.server).post('/a/communities').set('Authorization', token).send({
      name: 'Ca',
      city_id: city.id
    });
    expect(response.status).toBe(400);
  });

  it('Deve retornar várias comunidades', async () => {
    const response = await request(fastify.server).get('/communities');
    expect(response.body.communities).toBeInstanceOf(Array);
    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.per_page).toBe(10);
  });

  it('Deve excluir uma comunidade', async () => {
    const response = await request(fastify.server).delete(`/a/communities/${community.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });

  it('Não deve excluir uma comunidade que não existe', async () => {
    const response = await request(fastify.server).delete('/a/communities/93841').set('Authorization', token);
    expect(response.status).toBe(400);
  });

  it('Deve excluir uma cidade', async () => {
    const response = await request(fastify.server).delete(`/a/cities/${city.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });

  it('Deve excluir uma província', async () => {
    const response = await request(fastify.server).delete(`/a/provinces/${province.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });
});
