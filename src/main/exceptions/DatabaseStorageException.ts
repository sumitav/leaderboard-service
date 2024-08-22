export class DatabaseStorageException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseStorageException';
    }
}