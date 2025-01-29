"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HandlerError extends Error {
    constructor(status, name, message) {
        super();
        this.status = status;
        this.name = name;
        this.message = message;
    }
    static badRequest(name, message) {
        return new HandlerError(404, name, message);
    }
    static internal(name, message) {
        return new HandlerError(500, name, message);
    }
    static forbidden(name, message) {
        return new HandlerError(403, name, message);
    }
    static noUploadFile(name, message) {
        return new HandlerError(400, name, message);
    }
}
exports.default = HandlerError;
