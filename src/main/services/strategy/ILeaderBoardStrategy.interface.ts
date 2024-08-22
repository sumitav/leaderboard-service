
import PlayerScore from "../../models/playerScore.model";
export interface ILeaderBoardStrategy {
    sort(players: PlayerScore[]): PlayerScore[];
}
