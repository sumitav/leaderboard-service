"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseStorageException = void 0;
class DatabaseStorageException extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseStorageException';
    }
}
exports.DatabaseStorageException = DatabaseStorageException;
//# sourceMappingURL=DatabaseStorageException.js.map