"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
//Брокер запускаю в ubuntu 
const kafka = new kafkajs_1.Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROCKERS_HOST + ":" + process.env.KAFKA_BROCKERS_PORT],
    logLevel: kafkajs_1.logLevel.ERROR,
});
exports.default = kafka;
