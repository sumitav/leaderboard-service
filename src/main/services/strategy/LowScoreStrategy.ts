import PlayerScore from "../../models/playerScore.model";
import { ILeaderBoardStrategy } from "./ILeaderBoardStrategy.interface";

export class LowScoreStrategy implements ILeaderBoardStrategy {
    sort(players: PlayerScore[]): PlayerScore[] {
        return players.sort((a, b) => a.score - b.score);
    }
}