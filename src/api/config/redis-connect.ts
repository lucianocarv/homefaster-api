import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient
  .connect()
  .then(() => {
    return console.log('Redis Database Connected...');
  })
  .catch((err) => {
    return console.log('Redis fail to connect:', err);
  });

export { redisClient };
