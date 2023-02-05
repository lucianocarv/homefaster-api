import * as dotenv from 'dotenv';
dotenv.config();
import { server } from './index.js';

const app = async () => {
  const port = 3001;
  try {
    await server.listen({ port });
    console.log(`App running at port ${port}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

app();
