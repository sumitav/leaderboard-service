"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameController = void 0;
const logger_1 = __importDefault(require("../config/logger"));
class gameController {
    constructor(scoreIngestor) {
        this.scoreIngestor = scoreIngestor;
    }
    async updateScore(req, res) {
        const newScore = req.body;
        try {
            logger_1.default.info(`Updating score for player: ${newScore.player_id}`);
            await this.scoreIngestor.publish(newScore);
            res.status(200).send();
        }
        catch (e) {
            if (e instanceof Error) {
                logger_1.default.error(`Leaderboard Update failed - ${e.message}`);
                res.status(500).send({ error: e.message });
            }
            else {
                logger_1.default.error('Leaderboard Update failed - Unknown error');
                res.status(500).send({ error: 'Unknown error' });
            }
        }
    }
}
exports.gameController = gameController;
//# sourceMappingURL=gameController.js.map