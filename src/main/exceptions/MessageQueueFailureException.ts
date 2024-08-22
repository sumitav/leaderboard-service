export class MessageQueueFailureException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MessageQueueFailureException';
    }
}