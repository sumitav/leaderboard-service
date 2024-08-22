"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/main/config/redisConfig.ts
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
const redisClient = (0, redis_1.createClient)({ url: `${process.env.REDIS_URI}` });
redisClient.on('error', (error) => logger_1.default.error(`Error : ${error}`));
redisClient.connect().then(() => {
    logger_1.default.info('Connected to Redis');
}).catch((error) => {
    logger_1.default.error(`Failed to connect to Redis: ${error}`);
});
exports.default = redisClient;
//# sourceMappingURL=redisConfig.js.map