import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fastify } from '../../../app';
import request from 'supertest';
import { env_test_email, env_test_password } from '../../../environment';
import { prisma } from '../../config/prisma-connect';
import { Province } from '@prisma/client';

const req = request(fastify.server);
let token: string;
let province: Province;

describe('province-router tests', async () => {
  beforeAll(async () => {
    await fastify.listen();
    const request = await req.post('/users/login').send({ email: env_test_email, password: env_test_password });
    expect(request.body.token).toBeTypeOf('string');
    token = request.body.token;
  });

  afterAll(async () => {
    await prisma.$queryRaw`DELETE FROM provinces;`;
    await fastify.close();
  });

  describe('POST /a/province', async () => {
    it('province: must be create a province', async () => {
      const _province = { name: 'Alberta', short_name: 'AB' };
      const request = await req.post('/a/provinces').set('Authorization', token).send(_province);
      expect(request.status).toBe(201);
      expect(request.body.name).toBe(_province.name);
      province = request.body;
    });

    it('province: should not be create a province (already have the same record)', async () => {
      const _province = { name: 'Alberta', short_name: 'AB' };
      const request = await req.post('/a/provinces').set('Authorization', token).send(_province);
      expect(request.status).toBe(400);
    });
  });

  describe('GET /provinces', async () => {
    it('province: should return one province', async () => {
      const request = await req.get(`/provinces/${province.id}`);
      expect(request.status).toBe(200);
      expect(request.body.name).toBe(province.name);
      expect(request.body.short_name).toBe(province.short_name);
    });

    it('province: should return all provinces', async () => {
      const request = await req.get('/provinces');
      expect(request.status).toBe(200);
      expect(request.body.provinces).toBeInstanceOf(Array);
      expect(request.body.provinces.length).toBe(1);
      expect(request.body.page).toBe(1); // default value page=1
      expect(request.body.per_page).toBe(10); // default value per_page=10
    });

    it('province: should return all provinces (page 2 and per_page 5)', async () => {
      const request = await req.get('/provinces?page=2&per_page=5');
      expect(request.status).toBe(200);
      expect(request.body.provinces).toBeInstanceOf(Array);
      expect(request.body.page).toBe(2); // custom value page=2
      expect(request.body.per_page).toBe(5); // custom value per_page=5
    });

    it('province: should return all provinces (page -2 (convert to default) and per_page -5 (convert to default))', async () => {
      const request = await req.get('/provinces?page=-2&per_page=-5');
      expect(request.status).toBe(200);
      expect(request.body.provinces).toBeInstanceOf(Array);
      expect(request.body.page).toBe(1); // if value to be negative, the return must be default
      expect(request.body.per_page).toBe(10); // if value to be negative, the return must be default
    });
  });

  describe('PUT /provinces', async () => {
    it('province: should update a province (name and short_name)', async () => {
      const _province = { name: 'Albert', short_name: 'BA' };
      const request = await req.put(`/a/provinces/${province.id}`).set('Authorization', token).send(_province);
      expect(request.status).toBe(202);
      expect(request.body.name).toBe(_province.name);
    });

    it('province: should not be update a province', async () => {
      const _province = { name: 'Albert', short_name: 'A' };
      const request = await req.put(`/a/provinces/${province.id}`).set('Authorization', token).send(_province);
      expect(request.status).toBe(400);
    });
  });

  describe('DELETE /provinces', async () => {
    it('province: should delete a province', async () => {
      const request = await req.delete(`/a/provinces/${province.id}`).set('Authorization', token);
      expect(request.status).toBe(202);
    });

    it('province: should not delete a province', async () => {
      const request = await req.delete(`/a/provinces/${province.id + 100}`).set('Authorization', token);
      expect(request.status).toBe(400);
    });
  });
});
