import { LeaderBoardService } from '../../main/services/LeaderBoard.service';
import { ICache } from '../../main/interfaces/ICache.interface';
import PlayerScore from '../../main/models/playerScore.model';
import { PlayerScoreRepository } from '../../main/repositories/playerScore.repository';
import { IScoreIngestionLeaderBoard } from '../../main/interfaces/IScoreIngestionLeaderBoard.interface';
import { ILeaderBoardStrategy } from '../../main/services/strategy/ILeaderBoardStrategy.interface';
import { LeaderboardNotInitializedException } from '../../main/exceptions/LeaderboardNotInitializedException';
import { LeaderboardUpdateFailureException } from '../../main/exceptions/LeaderboardUpdateFailureException';
import { Constants } from '../../main/constants/constants';
import logger from '../../main/config/logger';

jest.mock('../../main/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

describe('LeaderBoardService', () => {
  let mockCache: jest.Mocked<ICache<PlayerScore>>;
  let mockScoreRepository: jest.Mocked<PlayerScoreRepository>;
  let mockScoreIngestor: jest.Mocked<IScoreIngestionLeaderBoard>;
  let mockStrategy: jest.Mocked<ILeaderBoardStrategy>;
  let leaderBoardService: LeaderBoardService;

  beforeEach(() => {
    mockCache = {
      initialize: jest.fn(),
      getTopNPlayers: jest.fn(),
      getScoreByPlayerId: jest.fn(),
      addToCache: jest.fn(),
    } as unknown as jest.Mocked<ICache<PlayerScore>>;

    mockScoreRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<PlayerScoreRepository>;

    mockScoreIngestor = {
      registerLeaderBoard: jest.fn(),
    } as unknown as jest.Mocked<IScoreIngestionLeaderBoard>;

    mockStrategy = {
      sort: jest.fn(),
    } as unknown as jest.Mocked<ILeaderBoardStrategy>;

    leaderBoardService = new LeaderBoardService(
      mockCache,
      mockScoreRepository,
      mockScoreIngestor,
      mockStrategy
    );
  });
  describe('createBoardWithSize', () => {
    it('should log the creation message and call initializeBoard with the specified size', async () => {
      const topN = 5;
      const scores: PlayerScore[] = [
        { player_id: '1', score: 100 },
        { player_id: '2', score: 150 },
        { player_id: '3', score: 200 },
        { player_id: '4', score: 250 },
        { player_id: '5', score: 300 },
        { player_id: '6', score: 350 }
      ] as PlayerScore[];
  
      // Mock the necessary methods
      mockScoreRepository.findAll.mockResolvedValue(scores);
      mockStrategy.sort.mockReturnValue(scores);
      mockCache.initialize.mockResolvedValue(undefined);
  
      await leaderBoardService.createBoardWithSize(topN);
  
      expect(logger.info).toHaveBeenCalledWith(`Creating Leader Board with size: ${topN}`);
      expect(mockCache.initialize).toHaveBeenCalledWith(topN, scores.slice(0, topN));
    });
  
    it('should handle zero and negative topN by calling initializeBoard with default size', async () => {
      const topN = -1;
      const scores: PlayerScore[] = [
        { player_id: '1', score: 100 },
        { player_id: '2', score: 150 },
        { player_id: '3', score: 200 },
        { player_id: '4', score: 250 },
        { player_id: '5', score: 300 }
      ] as PlayerScore[];
  
      // Mock the necessary methods
      mockScoreRepository.findAll.mockResolvedValue(scores);
      mockStrategy.sort.mockReturnValue(scores);
      mockCache.initialize.mockResolvedValue(undefined);
  
      await leaderBoardService.createBoardWithSize(topN);
  
      expect(logger.info).toHaveBeenCalledWith(`Creating Leader Board with size: ${Constants.DEFAULT_LEADERBOARD_SIZE}`);
      expect(mockCache.initialize).toHaveBeenCalledWith(Constants.DEFAULT_LEADERBOARD_SIZE, scores.slice(0, Constants.DEFAULT_LEADERBOARD_SIZE));
    });
  
    it('should call initializeBoard and log the size when topN is positive', async () => {
      const topN = 10;
      const scores: PlayerScore[] = [
        { player_id: '1', score: 100 },
        { player_id: '2', score: 150 },
        { player_id: '3', score: 200 }
      ] as PlayerScore[];
  
      // Mock the necessary methods
      mockScoreRepository.findAll.mockResolvedValue(scores);
      mockStrategy.sort.mockReturnValue(scores);
      mockCache.initialize.mockResolvedValue(undefined);
  
      await expect(leaderBoardService.createBoardWithSize(topN)).rejects.toThrow(LeaderboardNotInitializedException);
    });
  });
  

  describe('createBoard', () => {
    it('should initialize leaderboard with default size if topN is not positive', async () => {
      const topN = -1;
      const scores: PlayerScore[] = [
        { player_id: '1', score: 100 },
        { player_id: '2', score: 150 },
        { player_id: '3', score: 200 },
        { player_id: '4', score: 250 },
        { player_id: '5', score: 300 },
        { player_id: '6', score: 350 }
      ] as PlayerScore[];

      mockScoreRepository.findAll.mockResolvedValue(scores);
      mockStrategy.sort.mockReturnValue(scores);
      mockCache.initialize.mockResolvedValue(undefined);

      await leaderBoardService.createBoard(topN);

      expect(mockCache.initialize).toHaveBeenCalledWith(Constants.DEFAULT_LEADERBOARD_SIZE, scores.slice(0, Constants.DEFAULT_LEADERBOARD_SIZE));
    });

    it('should initialize leaderboard with specified size', async () => {
      const topN = 5;
      const scores: PlayerScore[] = [
        { player_id: '1', score: 100 },
        { player_id: '2', score: 150 },
        { player_id: '3', score: 200 },
        { player_id: '4', score: 250 },
        { player_id: '5', score: 300 },
        { player_id: '6', score: 350 }
      ] as PlayerScore[];

      mockScoreRepository.findAll.mockResolvedValue(scores);
      mockStrategy.sort.mockReturnValue(scores);
      mockCache.initialize.mockResolvedValue(undefined);

      await leaderBoardService.createBoard(topN);

      expect(mockCache.initialize).toHaveBeenCalledWith(topN, scores.slice(0, topN));
    });

    it('should throw an error if there are no scores', async () => {
      const topN = 5;
      mockScoreRepository.findAll.mockResolvedValue([]);

      await expect(leaderBoardService.createBoard(topN))
        .rejects
        .toThrow(LeaderboardNotInitializedException);
    });

    it('should throw an error if there are fewer scores than topN', async () => {
      const topN = 5;
      const scores: PlayerScore[] = [
        { player_id: '1', score: 100 },
        { player_id: '2', score: 150 }
      ] as PlayerScore[];

      mockScoreRepository.findAll.mockResolvedValue(scores);

      await expect(leaderBoardService.createBoard(topN))
        .rejects
        .toThrow(LeaderboardNotInitializedException);
    });
  });

  describe('getTopNPlayers', () => {
    it('should throw an error if leaderboard is not initialized', async () => {
      leaderBoardService['leaderBoardInitialized'] = false;
      await expect(leaderBoardService.getTopNPlayers()).rejects.toThrow(LeaderboardNotInitializedException);
    });

    it('should retrieve top players from cache if leaderboard is initialized', async () => {
      const players: PlayerScore[] = [{ player_id: '1', score: 100 }] as PlayerScore[];
      leaderBoardService['leaderBoardInitialized'] = true;
      mockCache.getTopNPlayers.mockResolvedValue(players);
      await expect(leaderBoardService.getTopNPlayers()).resolves.toEqual(players);
    });
  });

  describe('publish', () => {
    it('should add score to cache if new score is higher', async () => {
      const newScore: PlayerScore = { player_id: '1', score: 150 } as PlayerScore;
      const existingScore: PlayerScore = { player_id: '1', score: 100 } as PlayerScore;
      mockCache.getScoreByPlayerId.mockResolvedValue(existingScore);
      mockCache.addToCache.mockResolvedValue(undefined);
      await leaderBoardService.publish(newScore);
      expect(mockCache.addToCache).toHaveBeenCalledWith(newScore);
    });

    it('should not add score to cache if existing score is higher', async () => {
      const newScore: PlayerScore = { player_id: '1', score: 90 } as PlayerScore;
      const existingScore: PlayerScore = { player_id: '1', score: 100 } as PlayerScore;
      mockCache.getScoreByPlayerId.mockResolvedValue(existingScore);
      await leaderBoardService.publish(newScore);
      expect(mockCache.addToCache).not.toHaveBeenCalled();
    });

    it('should handle errors during score publishing', async () => {
      const newScore: PlayerScore = { player_id: '1', score: 150 } as PlayerScore;
      mockCache.getScoreByPlayerId.mockRejectedValue(new Error('Cache error'));
      await expect(leaderBoardService.publish(newScore)).rejects.toThrow(LeaderboardUpdateFailureException);
    });
  });
});
