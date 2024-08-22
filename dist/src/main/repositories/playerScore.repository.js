"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerScoreRepository = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const playerScore_model_1 = __importDefault(require("../models/playerScore.model"));
class PlayerScoreRepository {
    async findById(playerId) {
        logger_1.default.info('Finding player score by id: ', playerId);
        return playerScore_model_1.default.findOne({ where: { player_id: playerId } });
    }
    async findAll() {
        logger_1.default.info('Finding all player scores from the repository');
        return playerScore_model_1.default.findAll();
    }
    async save(playerScore) {
        const { player_id, score } = playerScore;
        logger_1.default.info('Saving player score: ', player_id);
        return await playerScore_model_1.default.create({ player_id, score });
    }
    async updateScore(playerId, score) {
        const existingScore = await this.findById(playerId);
        if (existingScore && existingScore.score >= score) {
            logger_1.default.info('Player Id exists: New score is not greater than existing score');
            return;
        }
        await playerScore_model_1.default.upsert({ player_id: playerId, score });
        logger_1.default.info('New Score updated successfully!!');
    }
}
exports.PlayerScoreRepository = PlayerScoreRepository;
//# sourceMappingURL=playerScore.repository.js.map