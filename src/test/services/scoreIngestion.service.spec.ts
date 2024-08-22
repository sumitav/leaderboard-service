import { Sequelize } from 'sequelize-typescript';
import PlayerScore from '../../main/models/playerScore.model';
import { ScoreIngestionService } from '../../main/services/ScoreIngestion.service';
import { DatabaseStorageException } from '../../main/exceptions/DatabaseStorageException';
import { LeaderboardUpdateFailureException } from '../../main/exceptions/LeaderboardUpdateFailureException';
import { PlayerScoreRepository } from '../../main/repositories/playerScore.repository';
import { LeaderBoardService } from '../../main/services/LeaderBoard.service';
import logger from '../../main/config/logger';
import DatabaseConfig from '../../main/config/databaseConfig';

jest.mock('../../main/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

const sequelize = DatabaseConfig;

beforeAll(async () => {
  await sequelize.authenticate();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('ScoreIngestionService', () => {
  let mockScoreRepository: jest.Mocked<PlayerScoreRepository>;
  let mockLeaderBoardService: jest.Mocked<LeaderBoardService>;
  let scoreIngestionService: ScoreIngestionService;

  beforeEach(() => {
    mockScoreRepository = {
      updateScore: jest.fn(),
    } as unknown as jest.Mocked<PlayerScoreRepository>;

    mockLeaderBoardService = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<LeaderBoardService>;

    scoreIngestionService = ScoreIngestionService.getInstance(mockScoreRepository);
  });

  describe('publishToStore', () => {
    it('should successfully save the score to the repository', async () => {
      const newScore = await PlayerScore.create({ player_id: '1', score: 100 });
      mockScoreRepository.updateScore.mockResolvedValue(undefined);
      await scoreIngestionService.publishToStore(newScore);
      expect(mockScoreRepository.updateScore).toHaveBeenCalledWith(newScore.player_id, newScore.score);
      expect(logger.info).toHaveBeenCalledWith('Score successfully saved to repository');
    });
  });

  describe('registerLeaderBoard', () => {
    it('should register a leaderboard', () => {
      scoreIngestionService.registerLeaderBoard(mockLeaderBoardService);
      expect(scoreIngestionService['leaderBoards']).toContain(mockLeaderBoardService);
      expect(logger.info).toHaveBeenCalledWith('Registering in-memory leaderboard...');
    });
  });

  describe('publishToLeaderBoards', () => {
    it('should publish score to all registered leaderboards', async () => {
      const newScore = await PlayerScore.create({ player_id: '1', score: 100 });
      scoreIngestionService.registerLeaderBoard(mockLeaderBoardService);
      await scoreIngestionService.publishToLeaderBoards(newScore);
      expect(mockLeaderBoardService.publish).toHaveBeenCalledWith(newScore);
      expect(logger.info).toHaveBeenCalledWith('Publishing score to leaderboards');
      expect(logger.info).toHaveBeenCalledWith('Successfully updated score to leaderboard!!');
    });

    it('should handle errors when publishing to leaderboards', async () => {
        const newScore = PlayerScore.build({ player_id: '1', score: 100 }); // This should create a PlayerScore instance
        scoreIngestionService.registerLeaderBoard(mockLeaderBoardService);
        mockLeaderBoardService.publish.mockRejectedValue(new Error('Update error'));
    
        await expect(scoreIngestionService.publishToLeaderBoards(newScore)).rejects.toThrow(LeaderboardUpdateFailureException);
        expect(logger.error).toHaveBeenCalledWith('Could not update leaderboard - Update error');
    });
  });
});
