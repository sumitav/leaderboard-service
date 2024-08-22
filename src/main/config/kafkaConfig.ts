import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import Logger from '../config/logger';

class KafkaConfig {
    private kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;
    private logger: typeof Logger = Logger;

    constructor() {
        this.kafka = new Kafka({
            clientId: "nodejs-kafka",
            brokers: ['localhost:9092']
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: "test-group" });
        this.logger.info('KafkaConfig initialized');
    }

    async produce(topic: string, messages: { key: string, value: string }[]): Promise<void> {
        try {
            this.logger.info(`Connecting producer for topic: ${topic}`);
            await this.producer.connect();
            this.logger.info(`Sending messages to topic: ${topic}`);
            await this.producer.send({
                topic,
                messages
            });
            this.logger.info(`Messages sent to topic: ${topic}`);
        } catch (err) {
            this.logger.error(`Error producing messages to topic: ${topic} - ${err.message}`);
            throw err;
        } finally {
            await this.producer.disconnect();
            this.logger.info(`Producer disconnected from topic: ${topic}`);
        }
    }

    async consume(topic: string, callback: (value: string) => void): Promise<void> {
        try {
            this.logger.info(`Connecting consumer for topic: ${topic}`);
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: topic, fromBeginning: true });
            this.logger.info(`Subscribed to topic: ${topic}`);
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                    const value = message.value?.toString();
                    if (value) {
                        this.logger.debug(`Received message from topic: ${topic} - ${value}`);
                        callback(value);
                    }
                }
            });
        } catch (err) {
            this.logger.error(`Error consuming messages from topic: ${topic} - ${err.message}`);
            throw err;
        }
    }
}

export default KafkaConfig;