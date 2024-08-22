"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreIngestionService = void 0;
const DatabaseStorageException_1 = require("../exceptions/DatabaseStorageException");
const LeaderboardUpdateFailureException_1 = require("../exceptions/LeaderboardUpdateFailureException");
const logger_1 = __importDefault(require("../config/logger"));
class ScoreIngestionService {
    constructor(scoreRepository) {
        this.leaderBoards = [];
        this.logger = logger_1.default;
        this.scoreRepository = scoreRepository;
    }
    /**
     * singelton instance of ScoreIngestionService
     * @param scoreRepository
     * @returns
     */
    static getInstance(scoreRepository) {
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
    async publishToStore(score) {
        try {
            await this.scoreRepository.updateScore(score.player_id, score.score);
            this.logger.info('Score successfully saved to repository');
        }
        catch (e) {
            this.logger.error(`Could not publish data to storage - ${e.message}`);
            throw new DatabaseStorageException_1.DatabaseStorageException(e.message);
        }
    }
    /**
     * method to register leaderboard and push to leaderboards
     * @param leaderBoard
     */
    registerLeaderBoard(leaderBoard) {
        this.logger.info(`Registering in-memory leaderboard...`);
        this.leaderBoards.push(leaderBoard);
    }
    /**
     * method that publishes score to leaderboards via registered leaderboards
     * @param newScore
     * @returns
     */
    async publishToLeaderBoards(newScore) {
        this.logger.info(`Publishing score to leaderboards`);
        if (this.leaderBoards.length === 0) {
            this.logger.warn('No leaderboards registered to update');
            return;
        }
        for (const leaderBoard of this.leaderBoards) {
            try {
                await leaderBoard.publish(newScore);
                this.logger.info(`Successfully updated score to leaderboard!!`);
            }
            catch (e) {
                if (e instanceof Error) {
                    this.logger.error(`Could not update leaderboard - ${e.message}`);
                    throw new LeaderboardUpdateFailureException_1.LeaderboardUpdateFailureException('Could not update leaderboard');
                }
            }
        }
    }
    /**
     * method to publish new score to storage(db) and leaderboards simultaneously
     * @param newScore
     */
    async publish(newScore) {
        try {
            this.logger.info(`Publishing score to storage and leaderBoards: ${newScore.score}`);
            await this.publishToStore(newScore);
            await this.publishToLeaderBoards(newScore);
        }
        catch (e) {
            if (e instanceof Error) {
                this.logger.error(`Failed to publish score - ${e.message}`);
                throw e;
            }
        }
    }
}
exports.ScoreIngestionService = ScoreIngestionService;
//# sourceMappingURL=ScoreIngestion.service.js.map