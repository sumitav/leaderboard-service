// leaderBoardController.test.ts
import request from 'supertest';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { LeaderBoardController } from '../../main/controllers/LeaderBoardController';
import { ILeaderBoard } from '../../main/interfaces/ILeaderBoard.interface';
import { LeaderBoardInput } from '../../main/models/leaderBoardInput.model';
import logger from '../../main/config/logger';
import { LeaderboardNotInitializedException } from '../../main/exceptions/LeaderboardNotInitializedException';

// Mocking dependencies
jest.mock('../../main/config/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
}));

const mockLeaderBoardService: ILeaderBoard = {
    getTopNPlayers: jest.fn(),
    createBoard: jest.fn(),
    publish: jest.fn(),
};

const app = express();
app.use(express.json());
const leaderBoardController = new LeaderBoardController(mockLeaderBoardService);
app.get('/top-scorers', leaderBoardController.getTopScorers.bind(leaderBoardController));
app.post('/create-board', leaderBoardController.createBoard.bind(leaderBoardController));

describe('LeaderBoardController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /top-scorers', () => {
        it('should return top scorers with status 200 when leaderboard is initialized', async () => {
            const mockPlayers = [{ playerId: '1', score: 100 }];
            (mockLeaderBoardService.getTopNPlayers as jest.Mock).mockResolvedValue(mockPlayers);
        
            const response = await request(app).get('/top-scorers');
        
            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body).toEqual(mockPlayers);
            expect(logger.info).toHaveBeenCalledWith('Fetching top scorers');
        });
        

        it('should return status 400 with error message when leaderboard is not initialized', async () => {
            (mockLeaderBoardService.getTopNPlayers as jest.Mock).mockRejectedValue(new LeaderboardNotInitializedException('Leaderboard not initialized'));

            const response = await request(app).get('/top-scorers');

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body).toEqual({ message: 'Please register/create LeaderBoard first' });
            expect(logger.error).toHaveBeenCalledWith('Leaderboard not initialized - Leaderboard not initialized');
        });

        it('should return status 500 with error message on unexpected errors', async () => {
            (mockLeaderBoardService.getTopNPlayers as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

            const response = await request(app).get('/top-scorers');

            expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual({ message: 'Unexpected error' });
            expect(logger.error).toHaveBeenCalledWith(`Couldn't get top scores - Error: Unexpected error`);
        });
    });

    describe('POST /create-board', () => {
        it('should create a board with status 201 when input is valid', async () => {
            const input = new LeaderBoardInput('board1', 10);
            (mockLeaderBoardService.createBoard as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app).post('/create-board').send(input);

            expect(response.status).toBe(StatusCodes.CREATED);
            expect(logger.info).toHaveBeenCalledWith('Leaderboard has been created successfully!!');
        });

        it('should return status 400 with error messages when input is invalid', async () => {
            const input = { boardID: 123, leaderBoardSize: 'not-a-number' }; // Invalid input
            const response = await request(app).post('/create-board').send(input);

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body).toEqual({ message: 'boardID is required and must be a string, leaderBoardSize is required and must be a number' });
            expect(logger.warn).toHaveBeenCalledWith('Leaderboard creation failed: boardID is required and must be a string, leaderBoardSize is required and must be a number');
        });

        it('should return status 500 with error message on unexpected errors', async () => {
            const input = new LeaderBoardInput('board1', 10);
            (mockLeaderBoardService.createBoard as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

            const response = await request(app).post('/create-board').send(input);

            expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(response.body).toEqual({ message: 'Unexpected error' });
            expect(logger.error).toHaveBeenCalledWith('Leaderboard creation failed - Unexpected error');
        });
    });
});
