import PlayerScore from '../models/playerScore.model';

export interface IScoreIngestionStorage {
    publishToStore(newScore:  PlayerScore): Promise<void>;
}