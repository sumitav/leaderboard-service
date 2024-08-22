import PlayerScore from '../models/playerScore.model';
import { ScoreIngestionService } from './ScoreIngestion.service';
import { Constants } from '../constants/constants';
import { IScoreConsumer } from '../interfaces/IScoreConsumer.interface';
import KafkaConfig from '../config/kafkaConfig';
import Logger from '../config/logger';
import { PlayerScoreRepository } from '../repositories/playerScore.repository';
export class ScoreConsumerService implements IScoreConsumer< PlayerScore> {
  private readonly kafkaConfig: KafkaConfig;
  private readonly scoreIngestor: ScoreIngestionService;
  private readonly logger: typeof Logger = Logger;

  constructor() {
    this.kafkaConfig = new KafkaConfig();
    const scoreRepository = new PlayerScoreRepository();
    this.scoreIngestor = ScoreIngestionService.getInstance(scoreRepository);
  }
  /**
   * method to consume data from kafka queue
   */
  public async consumeDataFromQueue(): Promise<void> {
    await this.kafkaConfig.consume(Constants.KAFKA_TOPIC, async (value: string) => {
      const newData:  PlayerScore = JSON.parse(value);
      try {
        await this.scoreIngestor.publish(newData);
        this.logger.debug(`Published ${JSON.stringify(newData)}`);
      } catch (e) {
        if(e instanceof Error)
        this.logger.error(`Could not publish new score - ${e.message}`);
      }
    });
  }
}