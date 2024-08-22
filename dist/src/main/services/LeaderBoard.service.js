"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderBoardService = void 0;
const constants_1 = require("../constants/constants");
const LeaderboardNotInitializedException_1 = require("../exceptions/LeaderboardNotInitializedException");
const LeaderboardUpdateFailureException_1 = require("../exceptions/LeaderboardUpdateFailureException");
const logger_1 = __importDefault(require("../config/logger"));
class LeaderBoardService {
    constructor(cache, scoreRepository, scoreIngestor, strategy) {
        this.cache = cache;
        this.scoreRepository = scoreRepository;
        this.scoreIngestor = scoreIngestor;
        this.strategy = strategy;
        this.leaderBoardInitialized = false;
        this.logger = logger_1.default;
    }
    /**
     * method to create leaderboard
     */
    async createBoard(topN) {
        //show default leaderboard size if topN is not provided
        if (topN <= 0) {
            topN = constants_1.Constants.DEFAULT_LEADERBOARD_SIZE;
        }
        await this.initializeBoard(topN);
    }
    /**
     * method to initialize leaderboard
     * @param topN
     *
     **/
    async initializeBoard(topN) {
        try {
            this.logger.info('Initializing Leaderboard...');
            const allScores = await this.scoreRepository.findAll();
            if (allScores.length === 0) {
                throw new LeaderboardNotInitializedException_1.LeaderboardNotInitializedException('No scores found in repository');
            }
            if (allScores.length < topN) {
                throw new LeaderboardNotInitializedException_1.LeaderboardNotInitializedException('Not enough scores found in repository');
            }
            //sort scores using strategy and trim only  to top N
            this.logger.info(`Sorting scores using strategy and trimming to top ${topN}`);
            const sortedScores = this.strategy.sort(allScores);
            const topScores = sortedScores.slice(0, topN);
            await this.cache.initialize(topN, topScores);
            this.scoreIngestor.registerLeaderBoard(this);
            this.leaderBoardInitialized = true;
            this.logger.info('Leaderboard has been initialized successfully!!');
        }
        catch (e) {
            if (e instanceof Error) {
                this.logger.error(`Leader Board Initialization Failed - ${e.message}`);
                throw new LeaderboardNotInitializedException_1.LeaderboardNotInitializedException(e.message);
            }
        }
    }
    /**
     * method to create leaderboard with size
     * @param topN
     */
    async createBoardWithSize(topN) {
        const size = topN > 0 ? topN : constants_1.Constants.DEFAULT_LEADERBOARD_SIZE;
        this.logger.info(`Creating Leader Board with size: ${size}`);
        const scores = await this.scoreRepository.findAll();
        const sortedScores = this.strategy.sort(scores);
        if (sortedScores.length < size) {
            this.logger.error(`Not enough scores found in repository`);
            throw new LeaderboardNotInitializedException_1.LeaderboardNotInitializedException('Not enough scores found in repository');
        }
        await this.cache.initialize(size, sortedScores.slice(0, size));
    }
    /**
     * method to get top N players from cache
     * @returns top N players
     */
    async getTopNPlayers() {
        if (!this.leaderBoardInitialized) {
            this.logger.error('Leader Board Not Initialized - Cannot retrieve top players');
            throw new LeaderboardNotInitializedException_1.LeaderboardNotInitializedException('LeaderBoard not yet initialized');
        }
        this.logger.info('Retrieving top players from cache...');
        return this.cache.getTopNPlayers();
    }
    /**
     * method to publish new score to cache
     * @param newScore
     */
    async publish(newScore) {
        try {
            this.logger.info(`Publishing score to cache: ${newScore.score}`);
            const existingScore = await this.cache.getScoreByPlayerId(newScore.player_id);
            if (!existingScore || newScore.score > existingScore.score) {
                await this.cache.addToCache(newScore);
            }
            else {
                this.logger.warn(`Oops!!Score not added to cache as existing score (${existingScore.score}) is higher or equal to new score`);
            }
        }
        catch (e) {
            if (e instanceof Error) {
                this.logger.error(`Leader Board Update failed - ${e.message}`);
                throw new LeaderboardUpdateFailureException_1.LeaderboardUpdateFailureException(e.message);
            }
        }
    }
}
exports.LeaderBoardService = LeaderBoardService;
//# sourceMappingURL=LeaderBoard.service.js.map