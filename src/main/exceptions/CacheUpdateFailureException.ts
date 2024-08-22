export class CacheUpdateFailureException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CacheUpdateFailureException';
    }
}