"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderBoardInput = void 0;
class LeaderBoardInput {
    constructor(boardID, leaderBoardSize) {
        this.boardID = boardID;
        this.leaderBoardSize = leaderBoardSize;
    }
    getBoardID() {
        return this.boardID;
    }
    setBoardID(boardID) {
        this.boardID = boardID;
    }
    getLeaderBoardSize() {
        return this.leaderBoardSize;
    }
    setLeaderBoardSize(leaderBoardSize) {
        this.leaderBoardSize = leaderBoardSize;
    }
}
exports.LeaderBoardInput = LeaderBoardInput;
//# sourceMappingURL=leaderBoardInput.model.js.map