import PlayerScore from '../models/playerScore.model';
export interface IScoreIngestion {
    publish(newScore:  PlayerScore): Promise<void>;
}