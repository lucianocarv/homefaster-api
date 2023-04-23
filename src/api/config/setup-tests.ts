import { fastify } from '../../app.js';
import request from 'supertest';
import { env_test_email, env_test_password } from '../../environment.js';
import { prisma } from './prisma-connect.js';

export async function setupTestsStart() {
  let token: string;
  await fastify.listen();
  const response = await request(fastify.server).post('/users/login').send({
    email: env_test_email,
    password: env_test_password
  });
  token = response.body.token;
  await prisma.province.findMany();
  return { authorization: token };
}

export async function setupTestsEnd() {
  await fastify.close();
}
