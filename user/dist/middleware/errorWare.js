"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const error_1 = __importDefault(require("../error"));
function default_1(err, req, res, next) {
    if (err instanceof error_1.default)
        res.status(err.status).json({ message: err.message, name: err.name });
    else
        res.status(500).json({ message: "We don`t know what is it error on server" });
}
