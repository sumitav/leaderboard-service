"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = exports.swaggerUi = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'LeaderBoard Service API',
            version: '1.0.0',
            description: 'API documentation for the leaderboard service',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                playerScore: {
                    type: 'object',
                    properties: {
                        player_id: {
                            type: 'string',
                            description: 'ID of the player',
                        },
                        score: {
                            type: 'integer',
                            description: 'Score of the player',
                        },
                    },
                    required: ['player_id', 'score'],
                },
                InputForLeaderBoard: {
                    type: 'object',
                    properties: {
                        boardID: {
                            type: 'string',
                            description: 'ID of the leaderboard',
                        },
                        leaderBoardSize: {
                            type: 'integer',
                            description: 'Size of the leaderboard',
                        },
                    },
                    required: ['boardID', 'leaderBoardSize'],
                },
            },
        },
    },
    apis: ['src/main/routes/*.ts'],
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.specs = specs;
//# sourceMappingURL=swagger.js.map