import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.dev' });
import { fastify } from './app.js';

const port = Number(process.env.PORT!) | 3000;
const host = process.env.HOST!;

const app = async () => {
  try {
    await fastify.listen({ port, host });
    console.log(`App running at http://localhost:${port}`);
  } catch (error) {
    fastify.log.error(error);
    fastify.close();
    process.exit(1);
  }
};

app();
