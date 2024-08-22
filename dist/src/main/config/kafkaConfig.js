"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const logger_1 = __importDefault(require("../config/logger"));
class KafkaConfig {
    constructor() {
        this.logger = logger_1.default;
        this.kafka = new kafkajs_1.Kafka({
            clientId: "nodejs-kafka",
            brokers: ['localhost:9092']
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: "test-group" });
        this.logger.info('KafkaConfig initialized');
    }
    async produce(topic, messages) {
        try {
            this.logger.info(`Connecting producer for topic: ${topic}`);
            await this.producer.connect();
            this.logger.info(`Sending messages to topic: ${topic}`);
            await this.producer.send({
                topic,
                messages
            });
            this.logger.info(`Messages sent to topic: ${topic}`);
        }
        catch (err) {
            this.logger.error(`Error producing messages to topic: ${topic} - ${err.message}`);
            throw err;
        }
        finally {
            await this.producer.disconnect();
            this.logger.info(`Producer disconnected from topic: ${topic}`);
        }
    }
    async consume(topic, callback) {
        try {
            this.logger.info(`Connecting consumer for topic: ${topic}`);
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: topic, fromBeginning: true });
            this.logger.info(`Subscribed to topic: ${topic}`);
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const value = message.value?.toString();
                    if (value) {
                        this.logger.debug(`Received message from topic: ${topic} - ${value}`);
                        callback(value);
                    }
                }
            });
        }
        catch (err) {
            this.logger.error(`Error consuming messages from topic: ${topic} - ${err.message}`);
            throw err;
        }
    }
}
exports.default = KafkaConfig;
//# sourceMappingURL=kafkaConfig.js.map