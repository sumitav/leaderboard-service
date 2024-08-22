import PlayerScore from '../models/playerScore.model';
export interface ILeaderBoard {
    createBoard(topN: number): Promise<void>;
    getTopNPlayers(): Promise< PlayerScore[]>;
    publish(newScore:  PlayerScore): Promise<void>;
}