import PlayerScore from '../models/playerScore.model';
import { CacheInitializationException } from '../exceptions/CacheInitializationException';
import { CacheUpdateFailureException } from '../exceptions/CacheUpdateFailureException';
import { ICache } from '../interfaces/ICache.interface';
import logger from '../config/logger';
import { ILeaderBoardStrategy } from './strategy/ILeaderBoardStrategy.interface';

export class InMemoryCacheService implements ICache< PlayerScore> {
  private topN: number;
  private minHeap:  PlayerScore[];
  private playerToScore: Map<string,  PlayerScore>;

  constructor(private readonly strategy: ILeaderBoardStrategy) {
    this.topN = 0;
    this.minHeap = [];
    this.playerToScore = new Map<string,  PlayerScore>();
    this.strategy = strategy;
  }
  /**
   * method to get score by player_id
   * @param player_id 
   * @returns PlayerScore | undefined
   */
  getScoreByPlayerId(player_id: string): PlayerScore | undefined {
    return this.playerToScore.get(player_id);
  }
  /**
   * method to initialize cache
   * @param topN 
   * @param dataSet 
   */
  async initialize(topN: number, dataSet:  PlayerScore[]): Promise<void> {
    logger.info(`Initializing cache with topN: ${topN}`);
    this.topN = topN;
    try {
      this.minHeap = [];
      this.playerToScore = new Map<string,  PlayerScore>();
      for (const score of dataSet) {
        if (this.minHeap.length < topN) {
          this.minHeap.push(score);
          this.playerToScore.set(score.player_id, score);
        } else if (score.score > this.minHeap[0].score) {
          const removedScore = this.minHeap.shift();
          this.minHeap.push(score);
          if (removedScore) {
            this.playerToScore.delete(removedScore.player_id);
          }
          this.playerToScore.set(score.player_id, score);
        }
      }
     this.strategy.sort(this.minHeap);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Failed to initialize cache - ${e.message}`);
        throw new CacheInitializationException('Failed to initialize cache');
      }
    }
  }
  /**
   * method to add to cache
   * @param score 
   */

  async addToCache(score: PlayerScore): Promise<void> {
    try {
      logger.info(`Adding to cache: ${score.score}`);
      const existingScore = this.playerToScore.get(score.player_id);

      if (existingScore) {
        logger.info(`Updating existing score for player: ${score.player_id}`);
        existingScore.score = score.score;
        //adjust heap
      } else if (this.minHeap.length < this.topN) {
        this.minHeap.push(score);
        this.playerToScore.set(score.player_id, score);
      } else if (score.score > this.minHeap[0].score) {
        const removedScore = this.minHeap.shift();
        if (removedScore) {
          this.playerToScore.delete(removedScore.player_id);
        }
        this.minHeap.push(score);
        this.playerToScore.set(score.player_id, score);
      }
      this.strategy.sort(this.minHeap);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Failed to add to cache - ${e.message}`);
        throw new CacheUpdateFailureException('Failed to add to cache');
      }
    }
  }
  /**
   * method to get top N players
   * @returns PlayerScore[]
   */

  getTopNPlayers():  PlayerScore[] {
    const res = [...this.minHeap];
    logger.info('Top players from cache has been retrieved successfully !!');
    return this.strategy.sort(res);
  }
}