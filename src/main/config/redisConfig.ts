// src/main/config/redisConfig.ts
import { createClient } from 'redis';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const redisClient = createClient({ url: `${process.env.REDIS_URI}` });

redisClient.on('error', (error) => logger.error(`Error : ${error}`));

redisClient.connect().then(() => {
    logger.info('Connected to Redis');
}).catch((error) => {
  logger.error(`Failed to connect to Redis: ${error}`);
});

export default redisClient;