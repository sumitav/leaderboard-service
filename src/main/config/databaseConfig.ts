// src/main/config/databaseConfig.ts
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import logger from './logger';
import PlayerScore from '../models/playerScore.model'; // Import the model

dotenv.config();

class DatabaseConfig {
  private static instance: DatabaseConfig;
  public sequelize: Sequelize;

  private constructor() {
    const isTestEnvironment = process.env.APP_ENVIRONMENT === 'local';

    this.sequelize = new Sequelize({
      database: process.env.DATABASE!,
      username: process.env.USER!,
      password: process.env.PASSWORD!,
      host: process.env.HOST!,
      dialect: 'postgres',
      logging: isTestEnvironment ? false : console.log,
      models: [PlayerScore], // Register the model
    });

    this.sequelize
      .authenticate()
      .then(() => {
        logger.info("Database successfully connected!!");
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }
}

export default DatabaseConfig.getInstance().sequelize;