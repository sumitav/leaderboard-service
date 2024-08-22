import { gameController } from '../controllers/gameController';
import {Router } from 'express';
import logger from '../config/logger';
import { ScoreIngestionService } from '../services/ScoreIngestion.service';
import { PlayerScoreRepository } from '../repositories/playerScore.repository';
import healthController from '../controllers/healthController';

const router = Router();
const playerScoreRepository = new PlayerScoreRepository();
const controller = new gameController(ScoreIngestionService.getInstance(playerScoreRepository));

/**
 * @swagger
 * This API provides endpoints for managing player scores in games.
 */

/**
 * @swagger
 * /game/updateScore:
 *   post:
 *     summary: Submit a new score
 *     description: Adds a new score for a player in a specific game.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/playerScore'
 *     responses:
 *       201:
 *         description: Score successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/playerScore'
 *       400:
 *         description: Invalid input
 */
router.post('/updateScore', async (req, res) => {
  const { player_id,score } = req.body;

  if (!score || typeof score !== 'number' || typeof player_id !== 'string') {
      const errorMessages = [];
      if (!score) errorMessages.push('Score is required');
      if (typeof score !== 'number') errorMessages.push('Score must be a number');
      if (typeof player_id !== 'string') errorMessages.push('player_id must be a string');

      logger.warn(`Score posting failed: ${errorMessages.join(', ')}`);
      return res.status(400).json({ error: errorMessages.join(', ') });
  }

  await controller.updateScore(req, res);
});

export default router;