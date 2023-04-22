import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env.test' });

import { fastify } from '../../app.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { env_test_email, env_test_password } from '../../environment.js';
import { prisma } from '../config/prisma-connect.js';

let token: string;

beforeAll(async () => {
  await fastify.listen();
  const response = await request(fastify.server).post('/users/login').send({
    email: env_test_email,
    password: env_test_password
  });

  token = response.body.token;
});

afterAll(async () => {
  await fastify.close();
});

describe('Province Routes', () => {
  let province: any;
  it('Deve criar uma província', async () => {
    const data = await prisma.$executeRaw`SELECT * FROM provinces;`;
    console.log(data);
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Ontario',
      short_name: 'ON'
    });
    province = response.body;
    expect(response.status).toBe(201);
  });

  it('Deve retornar erro, pois short_name deve ter 2 caracteres', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Alberta',
      short_name: 'ABC'
    });
    expect(response.status).toBe(400);
  });

  it('Deve retornar short_name formatado com Uppercase', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Saskatchewan',
      short_name: 'sk'
    });
    expect(response.status).toBe(201);
    expect(response.body.short_name).toBe('SK');
    await request(fastify.server).delete(`/a/provinces/${response.body.id}`).set('Authorization', token);
  });

  it('Deve editar informações da província', async () => {
    const response = await request(fastify.server).put(`/a/provinces/${province.id}`).set('Authorization', token).send({
      name: 'Ont',
      short_name: 'NO'
    });

    expect(response.status).toBe(202);
    expect(response.body.name).toBe('Ont');
    expect(response.body.short_name).toBe('NO');
  });

  it('Deve retornar uma província', async () => {
    const response = await request(fastify.server).get(`/provinces/${province.id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Ont');
    expect(response.body.short_name).toBe('NO');
  });

  it('Deve retornar várias províncias com page=1 e per_page10 (default)', async () => {
    const response = await request(fastify.server).get('/provinces');
    expect(response.body.page).toBe(1);
    expect(response.body.per_page).toBe(10);
    expect(response.status).toBe(200);
  });

  it('Deve retornar várias províncias com apenas 1 por página', async () => {
    const response = await request(fastify.server).get('/provinces?per_page=1');
    expect(response.body.page).toBe(1);
    expect(response.body.per_page).toBe(1);
    expect(response.status).toBe(200);
  });

  it('Deve excluir uma província', async () => {
    const response = await request(fastify.server).delete(`/a/provinces/${province.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });
});
