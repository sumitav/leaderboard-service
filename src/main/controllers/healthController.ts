import { Request, Response } from 'express';
import logger from '../config/logger';
import sequelize from '../config/databaseConfig';
class HealthController {
    /**
     * method to check the health of the application
     * @param req 
     * @param res 
     */
    public async check(req: Request, res: Response): Promise<void> {
        try {
            // Perform any necessary health checks here (e.g., database connection)
            const isDatabaseHealthy = await checkDatabaseHealth();
            if (!isDatabaseHealthy) {
                throw new Error('Database is not healthy');
            }
            logger.info('Health check passed');
            res.status(200).json({ status: 'UP' });
        } catch (error) {
            logger.error('Health check failed', error);
            res.status(500).json({ status: 'DOWN' });
        }
    }
}
/**
 * method to check the health of the database
 * @returns 
 */

async function checkDatabaseHealth(): Promise<boolean> {
    try {
        await sequelize.authenticate();
        logger.info('Database health check passed');
        return true;
    } catch (error) {
        logger.error('Database health check failed', error);
        return false;
    }
}

export default new HealthController();