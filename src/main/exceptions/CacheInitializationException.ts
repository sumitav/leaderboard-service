export class CacheInitializationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CacheInitializationException';
    }
}