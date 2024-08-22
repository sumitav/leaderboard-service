export class LeaderboardNotInitializedException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LeaderboardNotInitializedException';
    }
}