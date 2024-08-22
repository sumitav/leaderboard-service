import { Router } from 'express';
import { LeaderBoardController } from '../controllers/leaderBoardController';
import { LeaderBoardService } from '../services/LeaderBoard.service';
import { PlayerScoreRepository } from '../repositories/playerScore.repository';
import { IScoreIngestionLeaderBoard } from '../interfaces/IScoreIngestionLeaderBoard.interface';
import { ScoreIngestionService } from '../services/ScoreIngestion.service';
import { ILeaderBoard } from '../interfaces/ILeaderBoard.interface';
import { CacheFactory } from '../services/factory/CacheFactory';
import { Constants } from '../constants/constants';
import { HighScoreStrategy } from '../services/strategy/HighScoreStrategy';

const router = Router();

const cacheService = CacheFactory.createCache(Constants.CACHE_TYPE_IN_MEMORY);
const playerScoreRepository = new PlayerScoreRepository();
const scoreIngestor: IScoreIngestionLeaderBoard = ScoreIngestionService.getInstance(playerScoreRepository);
const leaderBoardService:ILeaderBoard = new LeaderBoardService(cacheService, playerScoreRepository, scoreIngestor,new HighScoreStrategy());
const leaderBoardController = new LeaderBoardController(leaderBoardService);


/**
 * @swagger
 * /leaderboard/getTopScorers:
 *   get:
 *     summary: Get top scorers
 *     responses:
 *       200:
 *         description: A list of top scorers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/playerScore'
 *       400:
 *         description: Leaderboard not initialized
 *       500:
 *         description: Internal server error
 */
router.get('/getTopScorers', (req, res) => leaderBoardController.getTopScorers(req, res));

/**
 * @swagger
 * /leaderboard/createBoard:
 *   post:
 *     summary: Create a new leaderboard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InputForLeaderBoard'
 *     responses:
 *       201:
 *         description: Leaderboard created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/createBoard', (req, res) => leaderBoardController.createBoard(req, res));

export default router;