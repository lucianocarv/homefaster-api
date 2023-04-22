import { fastify } from '../../app.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { setupTestsEnd, setupTestsStart } from '../config/setup-tests.js';

let token: string;

beforeAll(async () => {
  const { authorization } = await setupTestsStart();
  token = authorization;
});

afterAll(async () => {
  await setupTestsEnd();
});

let user = {
  first_name: 'Teste',
  last_name: 'Teste',
  email: 'tests@tests-homefaster-null.br',
  password: '123456xV',
  id: 0
};

describe('User Routes', async () => {
  it('Deve criar um usuário', async () => {
    const response = await request(fastify.server).post('/users/register').send(user);
    expect(response.status).toBe(201);
  });

  it('Deve realizar o login', async () => {
    const response = await request(fastify.server).post('/users/login').send({
      email: user.email,
      password: user.password
    });

    expect(response.status).toBe(202);
    expect(response.body.token).toBeTruthy();
    expect(response.body.payload.email).toBe(user.email);
  });

  it('Deve buscar um usuário pelo e-mail', async () => {
    const response = await request(fastify.server)
      .post('/a/users')
      .set('Authorization', token)
      .send({
        filter: {
          email: user.email
        }
      });
    user = response.body.users[0];
    expect(response.body.users[0].email).toBe(user.email);
  });

  it('Deve excluir um usuário', async () => {
    const response = await request(fastify.server).delete(`/a/users/admin/${user.id}`).set('Authorization', token);
    expect(response.status).toBe(202);
  });

  it('Não deve criar um usuário (senha precisa no mínimo 1 letra maiúscula, 1 minúscula e 1 número)', async () => {
    user.password = '1234567L';
    const response = await request(fastify.server).post('/users/register').send(user);
    expect(response.status).toBe(400);
  });

  it('Não deve criar um usuário (tamanho mínimo da senha requerido = 6)', async () => {
    user.password = '12Lc';
    const response = await request(fastify.server).post('/users/register').send(user);
    expect(response.status).toBe(400);
  });
});
