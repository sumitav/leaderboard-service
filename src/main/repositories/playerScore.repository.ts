import logger from '../config/logger';
import PlayerScore from '../models/playerScore.model';

export class PlayerScoreRepository {
    async findById(playerId: string): Promise<PlayerScore> {
        logger.info('Finding player score by id: ', playerId);
        return PlayerScore.findOne({ where: { player_id: playerId } });
    }

    async findAll(): Promise<PlayerScore[]> {
        logger.info('Finding all player scores from the repository');
        return PlayerScore.findAll();
    }

    async save(playerScore:PlayerScore): Promise<PlayerScore> {
        const { player_id, score } = playerScore;
        logger.info('Saving player score: ', player_id);
        return await PlayerScore.create({ player_id, score });
    }

    async updateScore(playerId: string, score: number): Promise<void> {
        const existingScore = await this.findById(playerId);
        if (existingScore && existingScore.score >= score) {
            logger.info('Player Id exists: New score is not greater than existing score');
            return;
        }
        await PlayerScore.upsert({ player_id: playerId, score });
        logger.info('New Score updated successfully!!');
    }
}