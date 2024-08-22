"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreConsumerService = void 0;
const ScoreIngestion_service_1 = require("./ScoreIngestion.service");
const constants_1 = require("../constants/constants");
const kafkaConfig_1 = __importDefault(require("../config/kafkaConfig"));
const logger_1 = __importDefault(require("../config/logger"));
const playerScore_repository_1 = require("../repositories/playerScore.repository");
class ScoreConsumerService {
    constructor() {
        this.logger = logger_1.default;
        this.kafkaConfig = new kafkaConfig_1.default();
        const scoreRepository = new playerScore_repository_1.PlayerScoreRepository();
        this.scoreIngestor = ScoreIngestion_service_1.ScoreIngestionService.getInstance(scoreRepository);
    }
    /**
     * method to consume data from kafka queue
     */
    async consumeDataFromQueue() {
        await this.kafkaConfig.consume(constants_1.Constants.KAFKA_TOPIC, async (value) => {
            const newData = JSON.parse(value);
            try {
                await this.scoreIngestor.publish(newData);
                this.logger.debug(`Published ${JSON.stringify(newData)}`);
            }
            catch (e) {
                if (e instanceof Error)
                    this.logger.error(`Could not publish new score - ${e.message}`);
            }
        });
    }
}
exports.ScoreConsumerService = ScoreConsumerService;
//# sourceMappingURL=ScoreConsumer.service.js.map