import * as dotenv from 'dotenv';
dotenv.config();
import { fastify } from './index.js';

const app = async () => {
  const port = 50021;
  try {
    await fastify.listen({ port });
    console.log(`App running at port ${port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

app();
