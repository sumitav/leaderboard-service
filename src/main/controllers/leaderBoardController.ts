import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ILeaderBoard } from '../interfaces/ILeaderBoard.interface';
import PlayerScore from '../models/playerScore.model';
import { LeaderBoardInput } from '../models/leaderBoardInput.model';
import logger from '../config/logger';
import { LeaderboardNotInitializedException } from '../exceptions/LeaderboardNotInitializedException';

export class LeaderBoardController {
  private leaderBoardService: ILeaderBoard;

  constructor(leaderBoardService: ILeaderBoard) {
    this.leaderBoardService = leaderBoardService;
  }

  public async getTopScorers(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Fetching top scorers');
      const topScorers: PlayerScore[] = await this.leaderBoardService.getTopNPlayers();
      res.status(StatusCodes.OK).json(topScorers);
    } catch (error) {
      if (error instanceof LeaderboardNotInitializedException) {
        logger.error(`Leaderboard not initialized - ${error.message}`);
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please register/create LeaderBoard first' });
      } else if (error instanceof Error) {
        logger.error(`Couldn't get top scores - ${error as any}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    }
  }

  public async createBoard(req: Request, res: Response) {
    try {
      const input: LeaderBoardInput = req.body;
      logger.info(`Creating leaderboard of size: ${input.leaderBoardSize}`);
      // Validation checks
      const errorMessages = [];
      if (!input.boardID || typeof input.boardID !== 'string') {
        errorMessages.push('boardID is required and must be a string');
      }
      if (!input.leaderBoardSize || typeof input.leaderBoardSize !== 'number') {
        errorMessages.push('leaderBoardSize is required and must be a number');
      }

      if (errorMessages.length > 0) {
        logger.warn(`Leaderboard creation failed: ${errorMessages.join(', ')}`);
        return res.status(StatusCodes.BAD_REQUEST).json({ message: errorMessages.join(', ') });
      }

      await this.leaderBoardService.createBoard(input.leaderBoardSize);
      logger.info(`Leaderboard has been created successfully!!`);
      res.status(StatusCodes.CREATED).send();
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Leaderboard creation failed - ${error.message}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
    }
  }
}