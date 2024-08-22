export class LeaderboardUpdateFailureException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LeaderboardUpdateFailureException';
    }
}