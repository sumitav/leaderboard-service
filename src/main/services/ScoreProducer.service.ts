import KafkaConfig from '../config/kafkaConfig';
import PlayerScore from '../models/playerScore.model';
import { MessageQueueFailureException } from '../exceptions/MessageQueueFailureException';
import { Constants } from '../constants/constants';
import Logger from '../config/logger';
import { IScoreProducer } from '../interfaces/IScoreProducer.interface';

export class ScoreProducer implements IScoreProducer< PlayerScore> {
  private readonly logger: typeof Logger = Logger;
  private readonly kafkaConfig: KafkaConfig;

  constructor() {
    this.kafkaConfig = new KafkaConfig();
  }
  /**
   * method to add data to queue
   * @param newScore 
   */
  async addDataToQueue(newScore:  PlayerScore): Promise<void> {
    try {
      this.logger.info(`Adding data to kafka queue: ${JSON.stringify(newScore)}`);
      await this.kafkaConfig.produce(Constants.KAFKA_TOPIC, [
        { key: newScore.player_id.toString(), value: JSON.stringify(newScore) },
      ]);
    } catch (e) {
    if(e instanceof Error) {
      this.logger.error(`Send message failed - ${e.message}`);
      throw new MessageQueueFailureException(e.message);
    }
}
  }
}