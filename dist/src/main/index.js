"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_1 = require("./swagger");
const game_routes_1 = __importDefault(require("../main/routes/game.routes"));
const leaderBoard_routes_1 = __importDefault(require("../main/routes/leaderBoard.routes"));
const logger_1 = __importDefault(require("../main/config/logger"));
const databaseConfig_1 = __importDefault(require("./config/databaseConfig"));
const healthController_1 = __importDefault(require("./controllers/healthController"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use('/api-docs', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.specs));
// Routes
app.use('/api/game', game_routes_1.default);
app.use('/api/leaderboard', leaderBoard_routes_1.default);
app.get('/health', healthController_1.default.check);
//
databaseConfig_1.default.sync().then(() => {
    app.listen(port, () => {
        logger_1.default.info(`Your wonderful server is running in port: ${port} !!!`);
    });
}).catch((err) => {
    if (err instanceof Error) {
        logger_1.default.error('Unable to connect to the database:', err);
    }
});
exports.default = app;
//# sourceMappingURL=index.js.map