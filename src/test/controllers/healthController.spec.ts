// healthController.test.ts
import request from 'supertest';
import express from 'express';
import HealthController from '../../main/controllers/healthController';
import sequelize from '../../main/config/databaseConfig';
import logger from '../../main/config/logger';

jest.mock('../../main/config/databaseConfig', () => ({
    authenticate: jest.fn()
}));

jest.mock('../../main/config/logger', () => ({
    info: jest.fn(),
    error: jest.fn()
}));

const app = express();
app.get('/health', HealthController.check.bind(HealthController));

describe('HealthController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return status 200 and UP when database is healthy', async () => {
        (sequelize.authenticate as jest.Mock).mockResolvedValueOnce(undefined);

        const response = await request(app).get('/health');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('UP');
        expect(logger.info).toHaveBeenCalledWith('Health check passed');
    });

    it('should return status 500 and DOWN when database is not healthy', async () => {
        (sequelize.authenticate as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app).get('/health');

        expect(response.status).toBe(500);
        expect(response.body.status).toBe('DOWN');
        expect(logger.error).toHaveBeenCalledWith('Health check failed', expect.any(Error));
    });
});
