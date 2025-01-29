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
const error_1 = __importDefault(require("../error"));
const kafka_1 = __importDefault(require("./kafka"));
class CustomKafka {
    createTopic(topic_1) {
        return __awaiter(this, arguments, void 0, function* (topic, numPartitions = 1) {
            if (!topic)
                return error_1.default.badRequest("[Kafka createTopic]", "[Kafka]: createTopic args is BAD!");
            const admin = kafka_1.default.admin();
            try {
                yield admin.connect();
                yield admin.createTopics({
                    topics: [{
                            topic: topic,
                            numPartitions: Math.max(1, numPartitions),
                            replicationFactor: Number(process.env.KAFKA_BROCKERS_REPLICATION_FACTOR)
                        }]
                });
            }
            catch (error) {
                yield admin.disconnect();
                return error_1.default.badRequest("[Kafka createTopic]", "[Kafka]: " + error);
            }
            yield admin.disconnect();
            return true;
        });
    }
    send(topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!topic || !message)
                return error_1.default.badRequest("[Kafka send]", "[Kafka]: send args is BAD!");
            message = Object.assign({
                headers: {},
                partition: 0,
                key: "user"
            }, message);
            const producer = kafka_1.default.producer();
            try {
                yield producer.connect();
                yield producer.send({
                    topic: topic,
                    messages: [Object.assign(Object.assign({}, message), { value: JSON.stringify(message.value) })],
                });
            }
            catch (error) {
                yield producer.disconnect();
                return error_1.default.badRequest("[Kafka send]", "[Kafka]: " + error);
            }
            yield producer.disconnect();
            return true;
        });
    }
    subscribe(config, topics, handlerMessages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!topics || !handlerMessages)
                return error_1.default.badRequest("[Kafka sub]", "[Kafka]: sub args is BAD!");
            if (topics.length !== handlerMessages.length)
                return error_1.default.badRequest("[Kafka sub]", "[Kafka]: count of topics and function handler is not equal!");
            config = Object.assign({
                groupId: "user-group",
                heartbeatInterval: 1000
            }, config);
            const consumer = kafka_1.default.consumer(config);
            try {
                yield consumer.connect();
                yield consumer.subscribe({ topics: topics, fromBeginning: true });
                yield consumer.run({
                    eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                        var _b, _c;
                        let parse_headers = message === null || message === void 0 ? void 0 : message.headers;
                        if (parse_headers) {
                            for (let key in parse_headers) {
                                if (parse_headers.hasOwnProperty(key)) {
                                    parse_headers[key] = (_b = parse_headers[key]) === null || _b === void 0 ? void 0 : _b.toString();
                                }
                            }
                        }
                        const res = Object.assign({}, {
                            topic: topic,
                            partition: partition,
                            message: Object.assign(Object.assign({}, message), { value: message.value ? JSON.parse(message.value.toString()) : '', key: (_c = message.key) === null || _c === void 0 ? void 0 : _c.toString(), headers: parse_headers })
                        });
                        let index = topics.indexOf(topic);
                        if (index !== -1)
                            yield handlerMessages[index](res);
                    }),
                });
            }
            catch (error) {
                yield consumer.disconnect();
                return error_1.default.badRequest("[Kafka send]", "[Kafka]: " + error);
            }
            yield consumer.disconnect();
            return true;
        });
    }
}
exports.default = new CustomKafka;
