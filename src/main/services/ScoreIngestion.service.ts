import PlayerScore from '../models/playerScore.model';
import { DatabaseStorageException } from '../exceptions/DatabaseStorageException';
import { LeaderboardUpdateFailureException } from '../exceptions/LeaderboardUpdateFailureException';
import { IScoreIngestion } from '../interfaces/IScoreIngestion.interface';
import { PlayerScoreRepository } from '../repositories/playerScore.repository';
import { LeaderBoardService } from './LeaderBoard.service';
import Logger from '../config/logger';
import { IScoreIngestionLeaderBoard } from '../interfaces/IScoreIngestionLeaderBoard.interface';
import { IScoreIngestionStorage } from '../interfaces/IScoreIngestionStorage.interface';
import { ILeaderBoard } from '../interfaces/ILeaderBoard.interface';

export class ScoreIngestionService implements IScoreIngestion,IScoreIngestionLeaderBoard,IScoreIngestionStorage {
  private static instance: ScoreIngestionService;
  private leaderBoards: ILeaderBoard[] = [];
  private scoreRepository: PlayerScoreRepository;
  private readonly logger: typeof Logger = Logger;

  constructor(scoreRepository: PlayerScoreRepository) {
    this.scoreRepository = scoreRepository;
  }
  /**
   * singelton instance of ScoreIngestionService
   * @param scoreRepository 
   * @returns 
   */
  public static getInstance(scoreRepository: PlayerScoreRepository): ScoreIngestionService {
    if (!ScoreIngestionService.instance) {
      ScoreIngestionService.instance = new ScoreIngestionService(scoreRepository);
    }
    return ScoreIngestionService.instance;
  }
  /**
   * method to publish data to storage 
   * @param newScore 
   * @returns 
   */

  public async publishToStore(score: PlayerScore): Promise<void> {
    try {
      await this.scoreRepository.updateScore(score.player_id, score.score);
      this.logger.info('Score successfully saved to repository');
    } catch (e) {
      this.logger.error(`Could not publish data to storage - ${e.message}`);
      throw new DatabaseStorageException(e.message);
    }
  }
  /**
   * method to register leaderboard and push to leaderboards
   * @param leaderBoard 
   */

  public registerLeaderBoard(leaderBoard: LeaderBoardService): void {
    this.logger.info(`Registering in-memory leaderboard...`);
    this.leaderBoards.push(leaderBoard);
  }
  /**
   * method that publishes score to leaderboards via registered leaderboards
   * @param newScore 
   * @returns 
   */
  public async publishToLeaderBoards(newScore: PlayerScore): Promise<void> {
    this.logger.info(`Publishing score to leaderboards`);
    if (this.leaderBoards.length === 0) {
      this.logger.warn('No leaderboards registered to update');
      return;
    }
    for (const leaderBoard of this.leaderBoards) {
      try {
        await leaderBoard.publish(newScore);
        this.logger.info(`Successfully updated score to leaderboard!!`);
      } catch (e) {
        if (e instanceof Error) {
          this.logger.error(`Could not update leaderboard - ${e.message}`);
          throw new LeaderboardUpdateFailureException('Could not update leaderboard');
        }
      }
    }
  }
  /**
   * method to publish new score to storage(db) and leaderboards simultaneously
   * @param newScore 
   */

  public async publish(newScore:PlayerScore): Promise<void> {
    try {
      this.logger.info(`Publishing score to storage and leaderBoards: ${newScore.score}`);
      await this.publishToStore(newScore);
      await this.publishToLeaderBoards(newScore);
    } catch (e) {
        if(e instanceof Error){
      this.logger.error(`Failed to publish score - ${e.message}`);
      throw e;
        }
    }
  }
}