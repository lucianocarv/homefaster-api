import { server } from './server.js';

const app = async () => {
  const port = 3000;
  try {
    await server.listen({ port });
    console.log(`App running at port ${port}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

app();
