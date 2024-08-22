"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
const databaseConfig_1 = __importDefault(require("../config/databaseConfig"));
class HealthController {
    /**
     * method to check the health of the application
     * @param req
     * @param res
     */
    async check(req, res) {
        try {
            // Perform any necessary health checks here (e.g., database connection)
            const isDatabaseHealthy = await checkDatabaseHealth();
            if (!isDatabaseHealthy) {
                throw new Error('Database is not healthy');
            }
            logger_1.default.info('Health check passed');
            res.status(200).json({ status: 'UP' });
        }
        catch (error) {
            logger_1.default.error('Health check failed', error);
            res.status(500).json({ status: 'DOWN' });
        }
    }
}
/**
 * method to check the health of the database
 * @returns
 */
async function checkDatabaseHealth() {
    try {
        await databaseConfig_1.default.authenticate();
        logger_1.default.info('Database health check passed');
        return true;
    }
    catch (error) {
        logger_1.default.error('Database health check failed', error);
        return false;
    }
}
exports.default = new HealthController();
//# sourceMappingURL=healthController.js.map