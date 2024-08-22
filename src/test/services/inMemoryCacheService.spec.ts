import { InMemoryCacheService } from '../../main/services/InMemoryCache.service';
import PlayerScore from '../../main/models/playerScore.model';
import { CacheInitializationException } from '../../main/exceptions/CacheInitializationException';
import { CacheUpdateFailureException } from '../../main/exceptions/CacheUpdateFailureException';
import { ILeaderBoardStrategy } from '../../main/services/strategy/ILeaderBoardStrategy.interface';
import logger from '../../main/config/logger';

jest.mock('../../main/config/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

const mockStrategy: ILeaderBoardStrategy = {
    sort: jest.fn((heap) => heap.sort((a, b) => b.score - a.score)),
};

describe('InMemoryCacheService', () => {
    let cacheService: InMemoryCacheService;
    const mockPlayerScore: PlayerScore = { player_id: '1', score: 100 } as unknown as PlayerScore;

    beforeEach(() => {
        cacheService = new InMemoryCacheService(mockStrategy);
        jest.clearAllMocks();
    });

    describe('getScoreByPlayerId', () => {
        it('should return the player score by player_id', () => {
            cacheService['playerToScore'].set('1', mockPlayerScore);

            const result = cacheService.getScoreByPlayerId('1');

            expect(result).toEqual(mockPlayerScore);
        });

        it('should return undefined if player_id is not found', () => {
            const result = cacheService.getScoreByPlayerId('nonexistent');

            expect(result).toBeUndefined();
        });
    });

    describe('initialize', () => {
        it('should initialize cache with topN and dataSet and sort the heap', async () => {
            const dataSet = [
                { player_id: '1', score: 50 } as unknown as PlayerScore,
                { player_id: '2', score: 150 } as unknown as PlayerScore,
                { player_id: '3', score: 100 } as unknown as PlayerScore,
            ];
    
            await cacheService.initialize(2, dataSet);
    
            expect(cacheService['playerToScore'].size).toBe(2);
            expect(cacheService['minHeap'].length).toBe(2);
            expect(mockStrategy.sort).toHaveBeenCalled();
        });
    
        it('should throw CacheInitializationException if initialization fails', async () => {
            const originalInitialize = cacheService.initialize;
            cacheService.initialize = async () => {
                throw new CacheInitializationException('Initialization error');
            };
    
            await expect(cacheService.initialize(2, [])).rejects.toThrow(CacheInitializationException);
            cacheService.initialize = originalInitialize;
        });
    });
    
    

    describe('addToCache', () => {
    
        it('should update an existing score in the cache', async () => {
            cacheService['playerToScore'].set('1', { player_id: '1', score: 50 } as unknown as PlayerScore);
    
            const updatedScore = { player_id: '1', score: 150 } as unknown as PlayerScore;
            await cacheService.addToCache(updatedScore);
    
            expect(cacheService['playerToScore'].get('1')).toEqual(updatedScore);
            expect(mockStrategy.sort).toHaveBeenCalled();
        });
    
        it('should handle CacheUpdateFailureException if adding fails', async () => {
            const originalAddToCache = cacheService.addToCache;
            cacheService.addToCache = async () => {
                throw new CacheUpdateFailureException('Update error');
            };
    
            await expect(cacheService.addToCache(mockPlayerScore)).rejects.toThrow(CacheUpdateFailureException);
            cacheService.addToCache = originalAddToCache;
        });
    });
    
    

    describe('getTopNPlayers', () => {
        it('should return sorted top N players from the cache', () => {
            const topNPlayers = [
                { player_id: '2', score: 200 } as unknown as PlayerScore,
                { player_id: '1', score: 100 } as unknown as PlayerScore,
            ];
            cacheService['minHeap'] = topNPlayers;

            const result = cacheService.getTopNPlayers();

            expect(result).toEqual(topNPlayers.sort((a, b) => b.score - a.score));
            expect(logger.info).toHaveBeenCalledWith('Top players from cache has been retrieved successfully !!');
        });
    });
});
