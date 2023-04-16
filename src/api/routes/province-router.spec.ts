import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env.test' });

import { fastify } from '../../app.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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

describe('Province Routes', () => {
  let province: any;
  it('Deve criar uma província', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'British Columbia',
      short_name: 'BC',
    });
    province = response.body;
    expect(response.status).toBe(201);
  });

  it('Deve editar informações da província', async () => {
    const response = await request(fastify.server).put(`/a/provinces/${province.id}`).set('Authorization', token).send({
      name: 'British',
      short_name: 'CB',
    });

    expect(response.status).toBe(202);
    expect(response.body.name).toBe('British');
    expect(response.body.short_name).toBe('CB');
  });

  it('Deve retornar uma província', async () => {
    const response = await request(fastify.server).get(`/provinces/${province.id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('British');
    expect(response.body.short_name).toBe('CB');
  });

  it('Deve excluir uma província', async () => {
    const response = await request(fastify.server).delete(`/a/provinces/${province.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });
});
