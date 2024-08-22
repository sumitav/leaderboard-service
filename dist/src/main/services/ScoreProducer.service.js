"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreProducer = void 0;
const kafkaConfig_1 = __importDefault(require("../config/kafkaConfig"));
const MessageQueueFailureException_1 = require("../exceptions/MessageQueueFailureException");
const constants_1 = require("../constants/constants");
const logger_1 = __importDefault(require("../config/logger"));
class ScoreProducer {
    constructor() {
        this.logger = logger_1.default;
        this.kafkaConfig = new kafkaConfig_1.default();
    }
    /**
     * method to add data to queue
     * @param newScore
     */
    async addDataToQueue(newScore) {
        try {
            this.logger.info(`Adding data to kafka queue: ${JSON.stringify(newScore)}`);
            await this.kafkaConfig.produce(constants_1.Constants.KAFKA_TOPIC, [
                { key: newScore.player_id.toString(), value: JSON.stringify(newScore) },
            ]);
        }
        catch (e) {
            if (e instanceof Error) {
                this.logger.error(`Send message failed - ${e.message}`);
                throw new MessageQueueFailureException_1.MessageQueueFailureException(e.message);
            }
        }
    }
}
exports.ScoreProducer = ScoreProducer;
//# sourceMappingURL=ScoreProducer.service.js.map