import PlayerScore from "../../models/playerScore.model";
import { ILeaderBoardStrategy } from "./ILeaderBoardStrategy.interface";

export class HighScoreStrategy implements ILeaderBoardStrategy {
    sort(players: PlayerScore[]): PlayerScore[] {
        return players.sort((a, b) => b.score - a.score);
    }
}