"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const setting = {
    name: process.env.REDIS_NAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB // 0-15 count
};
const redisConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    let url = `redis://${setting.host}:${setting.port}/${setting.db}`;
    if (setting.name && setting.password)
        url = `redis://${setting.name}:${setting.password}@${setting.host}:${setting.port}/${setting.db}`;
    return yield (0, redis_1.createClient)({ url })
        .on("error", (error) => {
        return error;
    })
        .connect();
});
exports.default = redisConnection;
