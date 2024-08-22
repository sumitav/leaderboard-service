import PlayerScore from '../models/playerScore.model';
import { IScoreIngestionLeaderBoard } from '../interfaces/IScoreIngestionLeaderBoard.interface';
import { Constants } from '../constants/constants';
import { LeaderboardNotInitializedException } from '../exceptions/LeaderboardNotInitializedException';
import { LeaderboardUpdateFailureException } from '../exceptions/LeaderboardUpdateFailureException';
import { PlayerScoreRepository } from '../repositories/playerScore.repository';
import { ILeaderBoard } from '../interfaces/ILeaderBoard.interface';
import { ICache } from '../interfaces/ICache.interface';
import { ILeaderBoardStrategy } from './strategy/ILeaderBoardStrategy.interface';
import logger from '../config/logger';
import { error } from 'console';


export class LeaderBoardService implements ILeaderBoard {
  private leaderBoardInitialized = false;
  private readonly logger = logger;

  constructor(
    private readonly cache: ICache<PlayerScore>,
    private readonly scoreRepository: PlayerScoreRepository,
    private readonly scoreIngestor: IScoreIngestionLeaderBoard,
    private readonly strategy: ILeaderBoardStrategy
  ) {}
  /**
   * method to create leaderboard
   */
  async createBoard(topN: number): Promise<void> {
    //show default leaderboard size if topN is not provided
    if(topN <= 0){
      topN=Constants.DEFAULT_LEADERBOARD_SIZE
    }
    await this.initializeBoard(topN);
  }
  /**
   * method to initialize leaderboard
   * @param topN
   * 
   **/

  private async initializeBoard(topN: number): Promise<void> {
    try {
        this.logger.info('Initializing Leaderboard...');
        const allScores = await this.scoreRepository.findAll();

        if (allScores.length === 0) {
            throw new LeaderboardNotInitializedException('No scores found in repository');
        }

        if (allScores.length < topN) {
            throw new LeaderboardNotInitializedException('Not enough scores found in repository');
        }
        //sort scores using strategy and trim only  to top N

        this.logger.info(`Sorting scores using strategy and trimming to top ${topN}`);
        const sortedScores = this.strategy.sort(allScores);
        const topScores = sortedScores.slice(0, topN);

        await this.cache.initialize(topN, topScores);
        this.scoreIngestor.registerLeaderBoard(this);
        this.leaderBoardInitialized = true;
        this.logger.info('Leaderboard has been initialized successfully!!');
    } catch (e) {
        if (e instanceof Error) {
            this.logger.error(`Leader Board Initialization Failed - ${e.message}`);
            throw new LeaderboardNotInitializedException(e.message);
        }
    }
}
  /**
   * method to create leaderboard with size
   * @param topN 
   */

  public async createBoardWithSize(topN: number): Promise<void> {
    const size = topN > 0 ? topN : Constants.DEFAULT_LEADERBOARD_SIZE;
    this.logger.info(`Creating Leader Board with size: ${size}`);
  
    const scores = await this.scoreRepository.findAll();
    const sortedScores = this.strategy.sort(scores);
  
    if (sortedScores.length < size) {
      this.logger.error(`Not enough scores found in repository`);
      throw new LeaderboardNotInitializedException('Not enough scores found in repository');
    }
  
    await this.cache.initialize(size, sortedScores.slice(0, size));
  }
  /**
   * method to get top N players from cache
   * @returns top N players
   */

  async getTopNPlayers(): Promise< PlayerScore[]> {
    if (!this.leaderBoardInitialized) {
      this.logger.error('Leader Board Not Initialized - Cannot retrieve top players');
      throw new LeaderboardNotInitializedException('LeaderBoard not yet initialized');
    }
    this.logger.info('Retrieving top players from cache...');
    return this.cache.getTopNPlayers();
  }
  /**
   * method to publish new score to cache
   * @param newScore 
   */
  async publish(newScore: PlayerScore): Promise<void> {
    try {
      this.logger.info(`Publishing score to cache: ${newScore.score}`);
      
      const existingScore = await this.cache.getScoreByPlayerId(newScore.player_id);
      
      if (!existingScore || newScore.score > existingScore.score) {
        await this.cache.addToCache(newScore);
      } else {
        this.logger.warn(`Oops!!Score not added to cache as existing score (${existingScore.score}) is higher or equal to new score`);
      }
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(`Leader Board Update failed - ${e.message}`);
        throw new LeaderboardUpdateFailureException(e.message);
      }
    }
  }
}