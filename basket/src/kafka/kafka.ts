import { Kafka, logLevel} from "kafkajs";




//Брокер запускаю в ubuntu 
const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROCKERS_HOST+":"+process.env.KAFKA_BROCKERS_PORT],
    logLevel: logLevel.ERROR,
});

export default kafka;