import { fastify } from '../../app.js';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { setupTestsEnd, setupTestsStart } from '../config/setup-tests.js';
import { City, Province } from '@prisma/client';
import { prisma } from '../config/prisma-connect.js';

let token: string;

beforeAll(async () => {
  const { authorization } = await setupTestsStart();
  token = authorization;
});

afterAll(async () => {
  await setupTestsEnd();
});

// Realiza testes referente as rotas de manipulação das Cidades

describe('City Routes', () => {
  let province: Province;
  let city: City;

  it('Deve criar uma província', async () => {
    const response = await request(fastify.server).post('/a/provinces').set('Authorization', token).send({
      name: 'Alberta',
      short_name: 'AB'
    });
    province = response.body;
    expect(response.status).toBe(201);
  });

  it('Deve criar uma cidade padrão', async () => {
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

  it('Não deve criar uma cidade que não existe na província', async () => {
    const response = await request(fastify.server)
      .post('/a/cities')
      .send({
        name: 'Toronto',
        province_id: province.id
      })
      .set('Authorization', token);
    expect(response.status).toBe(400);
  });

  it('Não deve criar uma cidade sem o id da província', async () => {
    const response = await request(fastify.server)
      .post('/a/cities')
      .send({
        name: 'Banff'
      })
      .set('Authorization', token);
    expect(response.status).toBe(400);
  });

  it('Não deve criar uma cidade igual a uma já cadastrada', async () => {
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

  it('Deve retornar várias cidades, listando 5 por página', async () => {
    const response = await request(fastify.server).get('/cities?per_page=5');
    expect(response.status).toBe(200);
    expect(response.body.cities).toBeInstanceOf(Array);
    expect(response.body.per_page).toBe(5);
  });

  it('Deve retornar várias cidades, listando 5 por página e na página 3', async () => {
    const response = await request(fastify.server).get('/cities?per_page=5&page=3');
    expect(response.status).toBe(200);
    expect(response.body.cities).toBeInstanceOf(Array);
    expect(response.body.per_page).toBe(5);
    expect(response.body.page).toBe(3);
  });

  it('Deve retornar apenas uma cidade', async () => {
    const response = await request(fastify.server).get(`/cities/${city.id}`);
    expect(response.body.id).toBeTypeOf('number');
    expect(response.body.name).toBeTypeOf('string');
  });

  it('Não deve retornar uma cidade que não existe', async () => {
    const response = await request(fastify.server).get('/cities/78282');
    expect(response.status).toBe(400);
  });

  it('Deve editar informações de uma cidade', async () => {
    const response = await request(fastify.server).put(`/a/cities/${city.id}`).set('Authorization', token).send({
      name: 'Grande'
    });

    expect(response.status).toBe(202);
    expect(response.body.name).toBe('Grande');
  });

  it('Não deve editar informações de uma cidade cujo nome seja menor que 3 caracteres', async () => {
    const response = await request(fastify.server).put(`/a/cities/${city.id}`).set('Authorization', token).send({
      name: 'Gr'
    });

    expect(response.status).toBe(400);
  });

  it('Não deve editar informações de uma cidade que não existe', async () => {
    const response = await request(fastify.server).put(`/a/cities/9898`).set('Authorization', token).send({
      name: 'Grande'
    });
    expect(response.status).toBe(400);
  });

  it('Deve excluir uma cidade', async () => {
    const response = await request(fastify.server).delete(`/a/cities/${city.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });

  it('Não deve excluir uma cidade que não existe', async () => {
    const response = await request(fastify.server).delete('/a/cities/98923').set('Authorization', token);
    expect(response.status).toBe(400);
  });

  it('Deve excluir uma província', async () => {
    const response = await request(fastify.server).delete(`/a/provinces/${province.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });
});
