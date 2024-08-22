import pino from 'pino';
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
const logger = pino(pinoOptions);

export default logger;
