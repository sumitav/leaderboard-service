import PlayerScore from '../models/playerScore.model';
import { LeaderBoardService } from '../services/LeaderBoard.service';

export interface IScoreIngestionLeaderBoard {
    registerLeaderBoard(leaderBoard: LeaderBoardService): void;
    publishToLeaderBoards(newScore:  PlayerScore): Promise<void>;
}