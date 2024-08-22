"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameController_1 = require("../controllers/gameController");
const express_1 = require("express");
const logger_1 = __importDefault(require("../config/logger"));
const ScoreIngestion_service_1 = require("../services/ScoreIngestion.service");
const playerScore_repository_1 = require("../repositories/playerScore.repository");
const router = (0, express_1.Router)();
const playerScoreRepository = new playerScore_repository_1.PlayerScoreRepository();
const controller = new gameController_1.gameController(ScoreIngestion_service_1.ScoreIngestionService.getInstance(playerScoreRepository));
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
    const { player_id, score } = req.body;
    if (!score || typeof score !== 'number' || typeof player_id !== 'string') {
        const errorMessages = [];
        if (!score)
            errorMessages.push('Score is required');
        if (typeof score !== 'number')
            errorMessages.push('Score must be a number');
        if (typeof player_id !== 'string')
            errorMessages.push('player_id must be a string');
        logger_1.default.warn(`Score posting failed: ${errorMessages.join(', ')}`);
        return res.status(400).json({ error: errorMessages.join(', ') });
    }
    await controller.updateScore(req, res);
});
exports.default = router;
//# sourceMappingURL=game.routes.js.map