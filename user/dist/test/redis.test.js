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
require("dotenv/config");
const assert_1 = __importDefault(require("assert"));
const redis_1 = __importDefault(require("../redis"));
describe("Redis tests", () => {
    it("Set", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("[Redis]: ", `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`);
        const result = yield redis_1.default.set("key", "field", "value");
        assert_1.default.equal(result, 1);
    })).timeout(15000);
    it("Get", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("[Redis]: ", `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`);
        const result = yield redis_1.default.get("key");
        assert_1.default.equal(result === null || result === void 0 ? void 0 : result.field, "value");
    })).timeout(15000);
    it("isHas", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("[Redis]: ", `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`);
        const result = yield redis_1.default.isHas("key");
        assert_1.default.equal(result, 1);
    })).timeout(15000);
    it("clearDBCashe", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("[Redis]: ", `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`);
        const result = yield redis_1.default.clearDBCashe();
        assert_1.default.equal(result, "OK");
    })).timeout(15000);
});
