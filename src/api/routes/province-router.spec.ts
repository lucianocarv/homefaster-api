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
    password: env_test_password
  });

  token = response.body.token;
});

afterAll(async () => {
  await fastify.close();
});

// Realiza testes referente as rotas de manipulação das Províncias

describe('Province Routes', () => {
  let province: any;

  it('Deve criar uma província padrão', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Ontario',
      short_name: 'ON'
    });
    province = response.body;
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Ontario');
  });

  it('Não deve criar uma província sem token de autorização', async () => {
    const response = await request(fastify.server).post('/a/provinces').send({
      name: 'Alberta',
      short_name: 'AB'
    });
    expect(response.status).toBe(401);
  });

  it('Não deve criar uma província igual a uma já cadastrada', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Ontario',
      short_name: 'ON'
    });
    expect(response.status).toBe(400);
  });

  it('Não deve criar uma província informando apenas o nome', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Alberta'
    });
    expect(response.status).toBe(400);
  });

  it('Não deve criar uma província informando apenas a abreviação', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      short_name: 'AB'
    });
    expect(response.status).toBe(400);
  });

  it('Deve retornar erro (short_name pode conter apenas 2 caracteres)', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Alberta',
      short_name: 'ABC'
    });
    expect(response.status).toBe(400);
  });

  it('Deve retornar erro (short_name conter 2 caracteres)', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Alberta',
      short_name: 'A'
    });
    expect(response.status).toBe(400);
  });

  it('Deve retornar o atributo short_name formatado com Uppercase', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Saskatchewan',
      short_name: 'sk'
    });
    expect(response.status).toBe(201);
    expect(response.body.short_name).toBe('SK');
    const deleteProvince = await request(fastify.server).delete(`/a/provinces/${response.body.id}`).set('Authorization', token);
    expect(deleteProvince.status).toBe(202);
  });

  it('Deve editar informações da província (name e short_name)', async () => {
    const response = await request(fastify.server).put(`/a/provinces/${province.id}`).set('Authorization', token).send({
      name: 'Ont',
      short_name: 'NO'
    });
    console.log(province);
    console.log(response.body);
    expect(response.status).toBe(202);
    expect(response.body.name).toBe('Ont');
    expect(response.body.short_name).toBe('NO');
  });

  it('Não deve editar informações da província se short_name não conter 2 caracteres', async () => {
    const response = await request(fastify.server).put(`/a/provinces/${province.id}`).set('Authorization', token).send({
      name: 'Ont',
      short_name: 'N'
    });

    expect(response.status).toBe(400);
  });

  it('Não deve editar informações da província que não existe', async () => {
    const response = await request(fastify.server).put(`/a/provinces/98989`).set('Authorization', token).send({
      name: 'Ontario',
      short_name: 'ON'
    });
    expect(response.status).toBe(400);
  });

  it('Deve retornar dados de uma província', async () => {
    const response = await request(fastify.server).get(`/provinces/${province.id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Ont');
    expect(response.body.short_name).toBe('NO');
  });

  it('Não deve retornar dados de uma província que não existe', async () => {
    const response = await request(fastify.server).get(`/provinces/989872`);
    expect(response.status).toBe(400);
  });

  it('Deve retornar dados de várias províncias', async () => {
    const response = await request(fastify.server).get('/provinces');
    expect(response.body.page).toBe(1);
    expect(response.body.per_page).toBe(10);
    expect(response.status).toBe(200);
  });

  it('Deve retornar várias províncias (a paginação deve retornar apenas uma por página)', async () => {
    const response = await request(fastify.server).get('/provinces?per_page=1');
    expect(response.body.page).toBe(1);
    expect(response.body.per_page).toBe(1);
    expect(response.status).toBe(200);
  });

  it('Deve excluir uma província', async () => {
    const response = await request(fastify.server).delete(`/a/provinces/${province.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });

  it('Não deve excluir uma província que não existe', async () => {
    const response = await request(fastify.server).delete(`/a/provinces/9898`).set('Authorization', token);
    expect(response.status).toBe(400);
  });
});
