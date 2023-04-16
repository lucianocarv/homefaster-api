import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env.test' });

import { fastify } from '../../app.js';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { env_test_email, env_test_password } from '../../environment.js';

let token: string;

beforeAll(async () => {
  await fastify.listen();
  const response = await request(fastify.server).post('/users/login').send({
    email: env_test_email,
    password: env_test_password,
  });

  token = response.body.token;
});

afterAll(async () => {
  await fastify.close();
});

describe('City Routes', () => {
  it('Deve retornar as cidades', async () => {
    const response = await request(fastify.server).get('/cities');
    expect(response.status).toBe(200);
  });

  let province: any;
  it('Deve criar uma província', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Alberta',
      short_name: 'AB',
    });
    province = response.body;
    expect(response.status).toBe(201);
  });

  let city: any;
  it('Deve criar uma cidade', async () => {
    const response = await request(fastify.server)
      .post('/a/cities')
      .send({
        name: 'Grande Prairie',
        province_id: province.id,
      })
      .set('Authorization', token);
    city = response.body;
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Grande Prairie');
    expect(response.body.province_id).toBe(province.id);
  });

  it('Deve retornar apenas uma cidade', async () => {
    const response = await request(fastify.server).get(`/cities/${city.id}`);
    expect(response.body.id).toBeTypeOf('number');
    expect(response.body.name).toBeTypeOf('string');
  });

  it('Deve editar informações de uma cidade', async () => {
    const response = await request(fastify.server).put(`/a/cities/${city.id}`).set('Authorization', token).send({
      name: 'Grande',
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
