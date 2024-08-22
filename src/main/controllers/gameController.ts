import { Request, Response } from 'express';
import PlayerScore from '../models/playerScore.model';
import logger from '../config/logger';
import { IScoreIngestion } from '../interfaces/IScoreIngestion.interface';

export class gameController {
  private scoreIngestor: IScoreIngestion;

  constructor(scoreIngestor: IScoreIngestion) {
    this.scoreIngestor = scoreIngestor;
}

  public async updateScore(req: Request, res: Response): Promise<void> {
    const newScore:PlayerScore = req.body;

    try {
      logger.info(`Updating score for player: ${newScore.player_id}`);
      await this.scoreIngestor.publish(newScore);
      res.status(200).send();
    } catch (e) {
      if (e instanceof Error) {
        logger.error(`Leaderboard Update failed - ${e.message}`);
        res.status(500).send({ error: e.message });
      } else {
        logger.error('Leaderboard Update failed - Unknown error');
        res.status(500).send({ error: 'Unknown error' });
      }
    }
  }
}