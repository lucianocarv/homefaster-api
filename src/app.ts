import * as dotenv from 'dotenv';
dotenv.config();
import { fastify } from './index.js';

const port = Number(process.env.PORT!);
const host = process.env.HOST!;

const app = async () => {
  try {
    await fastify.listen({ port, host });
    console.log(`App running at http://localhost:${port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

app();
