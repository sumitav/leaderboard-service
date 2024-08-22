"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCacheService = void 0;
const CacheInitializationException_1 = require("../exceptions/CacheInitializationException");
const CacheUpdateFailureException_1 = require("../exceptions/CacheUpdateFailureException");
const logger_1 = __importDefault(require("../config/logger"));
class InMemoryCacheService {
    constructor(strategy) {
        this.strategy = strategy;
        this.topN = 0;
        this.minHeap = [];
        this.playerToScore = new Map();
        this.strategy = strategy;
    }
    /**
     * method to get score by player_id
     * @param player_id
     * @returns PlayerScore | undefined
     */
    getScoreByPlayerId(player_id) {
        return this.playerToScore.get(player_id);
    }
    /**
     * method to initialize cache
     * @param topN
     * @param dataSet
     */
    async initialize(topN, dataSet) {
        logger_1.default.info(`Initializing cache with topN: ${topN}`);
        this.topN = topN;
        try {
            this.minHeap = [];
            this.playerToScore = new Map();
            for (const score of dataSet) {
                if (this.minHeap.length < topN) {
                    this.minHeap.push(score);
                    this.playerToScore.set(score.player_id, score);
                }
                else if (score.score > this.minHeap[0].score) {
                    const removedScore = this.minHeap.shift();
                    this.minHeap.push(score);
                    if (removedScore) {
                        this.playerToScore.delete(removedScore.player_id);
                    }
                    this.playerToScore.set(score.player_id, score);
                }
            }
            this.strategy.sort(this.minHeap);
        }
        catch (e) {
            if (e instanceof Error) {
                logger_1.default.error(`Failed to initialize cache - ${e.message}`);
                throw new CacheInitializationException_1.CacheInitializationException('Failed to initialize cache');
            }
        }
    }
    /**
     * method to add to cache
     * @param score
     */
    async addToCache(score) {
        try {
            logger_1.default.info(`Adding to cache: ${score.score}`);
            const existingScore = this.playerToScore.get(score.player_id);
            if (existingScore) {
                logger_1.default.info(`Updating existing score for player: ${score.player_id}`);
                existingScore.score = score.score;
                //adjust heap
            }
            else if (this.minHeap.length < this.topN) {
                this.minHeap.push(score);
                this.playerToScore.set(score.player_id, score);
            }
            else if (score.score > this.minHeap[0].score) {
                const removedScore = this.minHeap.shift();
                if (removedScore) {
                    this.playerToScore.delete(removedScore.player_id);
                }
                this.minHeap.push(score);
                this.playerToScore.set(score.player_id, score);
            }
            this.strategy.sort(this.minHeap);
        }
        catch (e) {
            if (e instanceof Error) {
                logger_1.default.error(`Failed to add to cache - ${e.message}`);
                throw new CacheUpdateFailureException_1.CacheUpdateFailureException('Failed to add to cache');
            }
        }
    }
    /**
     * method to get top N players
     * @returns PlayerScore[]
     */
    getTopNPlayers() {
        const res = [...this.minHeap];
        logger_1.default.info('Top players from cache has been retrieved successfully !!');
        return this.strategy.sort(res);
    }
}
exports.InMemoryCacheService = InMemoryCacheService;
//# sourceMappingURL=InMemoryCache.service.js.map