"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderBoardController = void 0;
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../config/logger"));
const LeaderboardNotInitializedException_1 = require("../exceptions/LeaderboardNotInitializedException");
class LeaderBoardController {
    constructor(leaderBoardService) {
        this.leaderBoardService = leaderBoardService;
    }
    async getTopScorers(req, res) {
        try {
            logger_1.default.info('Fetching top scorers');
            const topScorers = await this.leaderBoardService.getTopNPlayers();
            res.status(http_status_codes_1.StatusCodes.OK).json(topScorers);
        }
        catch (error) {
            if (error instanceof LeaderboardNotInitializedException_1.LeaderboardNotInitializedException) {
                logger_1.default.error(`Leaderboard not initialized - ${error.message}`);
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Please register/create LeaderBoard first' });
            }
            else if (error instanceof Error) {
                logger_1.default.error(`Couldn't get top scores - ${error}`);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
            }
        }
    }
    async createBoard(req, res) {
        try {
            const input = req.body;
            logger_1.default.info(`Creating leaderboard of size: ${input.leaderBoardSize}`);
            // Validation checks
            const errorMessages = [];
            if (!input.boardID || typeof input.boardID !== 'string') {
                errorMessages.push('boardID is required and must be a string');
            }
            if (!input.leaderBoardSize || typeof input.leaderBoardSize !== 'number') {
                errorMessages.push('leaderBoardSize is required and must be a number');
            }
            if (errorMessages.length > 0) {
                logger_1.default.warn(`Leaderboard creation failed: ${errorMessages.join(', ')}`);
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: errorMessages.join(', ') });
            }
            await this.leaderBoardService.createBoard(input.leaderBoardSize);
            logger_1.default.info(`Leaderboard has been created successfully!!`);
            res.status(http_status_codes_1.StatusCodes.CREATED).send();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_1.default.error(`Leaderboard creation failed - ${error.message}`);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
            }
        }
    }
}
exports.LeaderBoardController = LeaderBoardController;
//# sourceMappingURL=leaderBoardController.js.map