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
const kafka_1 = __importDefault(require("../kafka/"));
const assert_1 = __importDefault(require("assert"));
describe("Kafka tests", () => {
    it("Create Topic", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("[Kafka createTopic]: ", [process.env.KAFKA_BROCKERS_HOST + ":" + process.env.KAFKA_BROCKERS_PORT]);
        const result = yield kafka_1.default.createTopic("user");
        assert_1.default.equal(result, true);
    })).timeout(15000);
    it("Send", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("[Kafka send]: ", [process.env.KAFKA_BROCKERS_HOST + ":" + process.env.KAFKA_BROCKERS_PORT]);
        const result = yield kafka_1.default.send("user", { value: 'text some', headers: { "some_headers": "some-value" } });
        assert_1.default.equal(result, true);
    })).timeout(15000);
    it("Subscribe", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("[Kafka sub]: ", [process.env.KAFKA_BROCKERS_HOST + ":" + process.env.KAFKA_BROCKERS_PORT]);
        const result = yield kafka_1.default.subscribe({ groupId: "user-group" }, ["user"], [(arg) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                console.log(arg);
                assert_1.default.equal(arg.topic, "user");
                assert_1.default.equal(arg.message.value, "text some");
                assert_1.default.equal((_b = (_a = arg.message) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.some_headers, "some-value");
            })]);
    })).timeout(15000);
});
