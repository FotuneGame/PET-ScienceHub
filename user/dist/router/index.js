"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", (req, res, next) => {
    res.json({
        info: "[User] Date:" + new Date().toDateString() + new Date().getTime().toString()
    });
    next();
});
// TEST CODE IS UP ^_^
exports.default = router;
