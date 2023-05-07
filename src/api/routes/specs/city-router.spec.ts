import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fastify } from '../../../app';
import request from 'supertest';
import { env_test_email, env_test_password } from '../../../environment';
import { prisma } from '../../config/prisma-connect';
import { City, Province } from '@prisma/client';

const req = request(fastify.server);
let token: string;
let province: Province;
let city: City;

describe('city-router tests', async () => {
  beforeAll(async () => {
    await fastify.listen();
    const request = await req.post('/users/login').send({ email: env_test_email, password: env_test_password });
    expect(request.body.token).toBeTypeOf('string');
    token = request.body.token;
  });

  afterAll(async () => {
    await prisma.$queryRaw`DELETE FROM cities;`;
    await prisma.$queryRaw`DELETE FROM provinces;`;
    await fastify.close();
  });

  describe('POST /a/cities', async () => {
    it('city: should be create a province', async () => {
      const _province = { name: 'Alberta', short_name: 'AB' };
      const request = await req.post('/a/provinces').set('Authorization', token).send(_province);
      expect(request.status).toBe(201);
      expect(request.body.name).toBe(_province.name);
      province = request.body;
    });

    it('city: should be create a city', async () => {
      const _city = { name: 'Calgary', province_id: province.id };
      console.log(_city);
      const request = await req.post('/a/cities').set('Authorization', token).send(_city);
      console.log(request.body);
      expect(request.status).toBe(201);
      expect(request.body.name).toBe(_city.name);
      city = request.body;
    });
  });

  describe('GET /cities', async () => {
    it('city: should be return one city', async () => {
      const request = await req.get(`/cities/${city.id}`);
      expect(request.status).toBe(200);
      expect(request.body.name).toBe(city.name);
    });

    it('city: should be return cities', async () => {
      const request = await req.get('/cities');
      expect(request.status).toBe(200);
      expect(request.body.cities).toBeInstanceOf(Array);
    });

    it('city: should be return cities (page 2 and per_page 5)', async () => {
      const request = await req.get('/cities?page=2&per_page=5');
      expect(request.status).toBe(200);
      expect(request.body.page).toBe(2);
      expect(request.body.per_page).toBe(5);
      expect(request.body.cities).toBeInstanceOf(Array);
    });

    it('city: should be return cities (page -2 (convert to default) and per_page -5 (convert to default))', async () => {
      const request = await req.get('/cities?page=-2&per_page=-5');
      expect(request.status).toBe(200);
      expect(request.body.page).toBe(1);
      expect(request.body.per_page).toBe(10);
      expect(request.body.cities).toBeInstanceOf(Array);
    });
  });
});
