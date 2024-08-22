"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const isProductionEnv = process.env.APP_ENVIRONMENT === 'prod';
const pinoOptions = {
    level: isProductionEnv ? 'info' : 'debug',
    transport: isProductionEnv
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: true,
                ignore: 'pid,hostname',
            },
        },
};
// configure logger
const logger = (0, pino_1.default)(pinoOptions);
exports.default = logger;
//# sourceMappingURL=logger.js.map