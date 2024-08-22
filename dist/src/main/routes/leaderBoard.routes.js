"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderBoardController_1 = require("../controllers/leaderBoardController");
const LeaderBoard_service_1 = require("../services/LeaderBoard.service");
const playerScore_repository_1 = require("../repositories/playerScore.repository");
const ScoreIngestion_service_1 = require("../services/ScoreIngestion.service");
const CacheFactory_1 = require("../services/factory/CacheFactory");
const constants_1 = require("../constants/constants");
const HighScoreStrategy_1 = require("../services/strategy/HighScoreStrategy");
const router = (0, express_1.Router)();
const cacheService = CacheFactory_1.CacheFactory.createCache(constants_1.Constants.CACHE_TYPE_IN_MEMORY);
const playerScoreRepository = new playerScore_repository_1.PlayerScoreRepository();
const scoreIngestor = ScoreIngestion_service_1.ScoreIngestionService.getInstance(playerScoreRepository);
const leaderBoardService = new LeaderBoard_service_1.LeaderBoardService(cacheService, playerScoreRepository, scoreIngestor, new HighScoreStrategy_1.HighScoreStrategy());
const leaderBoardController = new leaderBoardController_1.LeaderBoardController(leaderBoardService);
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
exports.default = router;
//# sourceMappingURL=leaderBoard.routes.js.map