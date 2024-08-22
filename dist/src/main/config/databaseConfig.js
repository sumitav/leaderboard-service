"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/main/config/databaseConfig.ts
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger"));
const playerScore_model_1 = __importDefault(require("../models/playerScore.model")); // Import the model
dotenv_1.default.config();
class DatabaseConfig {
    constructor() {
        const isTestEnvironment = process.env.APP_ENVIRONMENT === 'local';
        this.sequelize = new sequelize_typescript_1.Sequelize({
            database: process.env.DATABASE,
            username: process.env.USER,
            password: process.env.PASSWORD,
            host: process.env.HOST,
            dialect: 'postgres',
            logging: isTestEnvironment ? false : console.log,
            models: [playerScore_model_1.default], // Register the model
        });
        this.sequelize
            .authenticate()
            .then(() => {
            logger_1.default.info("Database successfully connected!!");
        })
            .catch((err) => {
            logger_1.default.error(err);
        });
    }
    static getInstance() {
        if (!DatabaseConfig.instance) {
            DatabaseConfig.instance = new DatabaseConfig();
        }
        return DatabaseConfig.instance;
    }
}
exports.default = DatabaseConfig.getInstance().sequelize;
//# sourceMappingURL=databaseConfig.js.map