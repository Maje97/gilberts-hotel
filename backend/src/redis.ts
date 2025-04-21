import { createClient } from 'redis';
import dotenv from "dotenv";
import logger from './utils/logger';

dotenv.config();

const redisURL = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisURL,
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));

(async () => {
  try {
    await redisClient.connect();
    logger.info("Redis connected successfully.")
  } catch (err) {
    logger.error(`Redis connection failed: ${err}`)
  }
})();

export default redisClient;