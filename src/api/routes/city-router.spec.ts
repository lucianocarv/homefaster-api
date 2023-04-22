import { fastify } from '../../app.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { setupTestsEnd, setupTestsStart } from '../config/setup-tests.js';
import { City, Province } from '@prisma/client';

let token: string;

beforeAll(async () => {
  const { authorization } = await setupTestsStart();
  token = authorization;
});

afterAll(async () => {
  await setupTestsEnd();
});

describe('City Routes', () => {
  let province: Province;
  let city: City;

  it('Deve criar uma província', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Alberta',
      short_name: 'AB'
    });
    province = response.body;
    console.log(response);
    expect(response.status).toBe(201);
  });

  it('Deve criar uma cidade', async () => {
    const response = await request(fastify.server)
      .post('/a/cities')
      .send({
        name: 'Grande Prairie',
        province_id: province.id
      })
      .set('Authorization', token);
    city = response.body;
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Grande Prairie');
    expect(response.body.province_id).toBe(province.id);
  });

  it('Não deve criar uma cidade igual', async () => {
    const response = await request(fastify.server)
      .post('/a/cities')
      .send({
        name: 'Grande Prairie',
        province_id: province.id
      })
      .set('Authorization', token);
    console.log(response.body);
    expect(response.status).toBe(400);
  });

  it('Não deve criar uma cidade sem token de autorização', async () => {
    const response = await request(fastify.server).post('/a/cities').send({
      name: 'Grande Prairie',
      province_id: province.id
    });

    expect(response.status).toBe(401);
  });

  it('Deve retornar várias cidades', async () => {
    const response = await request(fastify.server).get('/cities');
    expect(response.status).toBe(200);
    expect(response.body.cities).toBeInstanceOf(Array);
    expect(response.body.page).toBeTypeOf('number');
    expect(response.body.per_page).toBeTypeOf('number');
    expect(response.body.cities.length).toBeGreaterThanOrEqual(1);
  });

  it('Deve retornar apenas uma cidade', async () => {
    const response = await request(fastify.server).get(`/cities/${city.id}`);
    expect(response.body.id).toBeTypeOf('number');
    expect(response.body.name).toBeTypeOf('string');
  });

  it('Deve editar informações de uma cidade', async () => {
    const response = await request(fastify.server).put(`/a/cities/${city.id}`).set('Authorization', token).send({
      name: 'Grande'
    });

    expect(response.status).toBe(202);
    expect(response.body.name).toBe('Grande');
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
