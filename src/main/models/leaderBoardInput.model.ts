
export class LeaderBoardInput {
    boardID: string;
    leaderBoardSize: number;

    constructor(boardID: string, leaderBoardSize: number) {
        this.boardID = boardID;
        this.leaderBoardSize = leaderBoardSize;
    }

    getBoardID(): string {
        return this.boardID;
    }

    setBoardID(boardID: string): void {
        this.boardID = boardID;
    }

    getLeaderBoardSize(): number {
        return this.leaderBoardSize;
    }

    setLeaderBoardSize(leaderBoardSize: number): void {
        this.leaderBoardSize = leaderBoardSize;
    }
}