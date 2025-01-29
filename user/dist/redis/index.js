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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("./redis"));
const error_1 = __importDefault(require("../error"));
class CustomRedis {
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                return error_1.default.badRequest("[Redis get]", "Args is BAD!");
            const redis = yield (0, redis_1.default)();
            try {
                const result = yield redis.hGetAll(key);
                return result;
            }
            catch (err) {
                return error_1.default.badRequest("[Redis get]", "Cannot HGETALL, show more: " + err + "\n[Redis]" + redis);
            }
            finally {
                yield redis.quit();
            }
        });
    }
    set(key, field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key || !field || !value)
                return error_1.default.badRequest("[Redis set]", "Args is BAD!");
            const redis = yield (0, redis_1.default)();
            try {
                const result = yield redis.hSet(key, field, value);
                return result;
            }
            catch (err) {
                return error_1.default.badRequest("[Redis set]", "Cannot HSET, show more: " + err + "\n[Redis]" + redis);
            }
            finally {
                yield redis.quit();
            }
        });
    }
    isHas(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!key)
                return error_1.default.badRequest("[Redis iHas]", "Args is BAD!");
            const redis = yield (0, redis_1.default)();
            try {
                const result = yield redis.EXISTS(key);
                return result;
            }
            catch (err) {
                return error_1.default.badRequest("[Redis  isHas]", "Cannot EXISTS, show more: " + err + "\n[Redis]" + redis);
            }
            finally {
                yield redis.quit();
            }
        });
    }
    clearDBCashe() {
        return __awaiter(this, void 0, void 0, function* () {
            const redis = yield (0, redis_1.default)();
            try {
                const result = yield redis.flushDb();
                return result;
            }
            catch (err) {
                return error_1.default.badRequest("[Redis  clearAllCash]", "Cannot FLUSHDB, show more: " + err + "\n[Redis]" + redis);
            }
            finally {
                yield redis.quit();
            }
        });
    }
}
exports.default = new CustomRedis;
