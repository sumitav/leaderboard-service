import request from 'supertest';
import express, { Express } from 'express';
import { gameController } from '../../main/controllers/gameController';
import PlayerScore from '../../main/models/playerScore.model';
import { IScoreIngestion } from '../../main/interfaces/IScoreIngestion.interface';
import logger from '../../main/config/logger';

jest.mock('../../main/config/logger');

describe('gameController', () => {
  let app: Express;
  let mockScoreIngestor: jest.Mocked<IScoreIngestion>;
  let controller: gameController;

  beforeEach(() => {
    mockScoreIngestor = {
      publish: jest.fn(),
    } as jest.Mocked<IScoreIngestion>;

    controller = new gameController(mockScoreIngestor);

    app = express();
    app.use(express.json());
    app.post('/update-score', (req, res) => controller.updateScore(req, res));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update score and return 200 status', async () => {
    const newScore = { player_id: '1', score: 100 } as PlayerScore;

    await request(app)
      .post('/update-score')
      .send(newScore)
      .expect(200);

    expect(mockScoreIngestor.publish).toHaveBeenCalledWith(newScore);
    expect(logger.info).toHaveBeenCalledWith('Updating score for player: 1');
  });

  it('should handle errors during score update and return 500 status', async () => {
    const newScore = { player_id: '1', score: 100 } as PlayerScore;
    const errorMessage = 'Database error';
    mockScoreIngestor.publish.mockRejectedValueOnce(new Error(errorMessage));

    await request(app)
      .post('/update-score')
      .send(newScore)
      .expect(500, { error: errorMessage });

    expect(mockScoreIngestor.publish).toHaveBeenCalledWith(newScore);
    expect(logger.error).toHaveBeenCalledWith(`Leaderboard Update failed - ${errorMessage}`);
  });

  it('should handle unknown errors and return 500 status', async () => {
    const newScore = { player_id: '1', score: 100 } as PlayerScore;
    mockScoreIngestor.publish.mockRejectedValueOnce('Unknown error');

    await request(app)
      .post('/update-score')
      .send(newScore)
      .expect(500, { error: 'Unknown error' });

    expect(mockScoreIngestor.publish).toHaveBeenCalledWith(newScore);
    expect(logger.error).toHaveBeenCalledWith('Leaderboard Update failed - Unknown error');
  });
});
