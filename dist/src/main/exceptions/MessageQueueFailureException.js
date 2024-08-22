"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueueFailureException = void 0;
class MessageQueueFailureException extends Error {
    constructor(message) {
        super(message);
        this.name = 'MessageQueueFailureException';
    }
}
exports.MessageQueueFailureException = MessageQueueFailureException;
//# sourceMappingURL=MessageQueueFailureException.js.map