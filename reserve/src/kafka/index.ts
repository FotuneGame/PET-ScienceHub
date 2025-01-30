import type {HandlerMessage, HandlerMessageArg} from "./types";
import type { Message,ConsumerConfig } from "kafkajs";
import HandlerError from "../error";
import kafka from "./kafka";



class CustomKafka{


    
    async createTopic(topic:string ,numPartitions = 1) {
        if(!topic) 
            return HandlerError.badRequest("[Kafka createTopic]","[Kafka]: createTopic args is BAD!");


        const admin = kafka.admin();

        try {
            await admin.connect();
            await admin.createTopics({
                    topics: [{
                        topic: topic,
                        numPartitions: Math.max(1,numPartitions),
                        replicationFactor: Number(process.env.KAFKA_BROCKERS_REPLICATION_FACTOR)
                    }]
            });

        } catch (error) {
            await admin.disconnect();
            return HandlerError.badRequest("[Kafka createTopic]","[Kafka]: "+error);
        }

        await admin.disconnect();
        return true;
    }



    async send(topic:string, message: Message){
        if(!topic || !message) 
            return HandlerError.badRequest("[Kafka send]","[Kafka]: send args is BAD!");

        message = Object.assign({
            headers: {},
            partition: 0,
            key: "user"
        }, message);
        

        const producer = kafka.producer();

        try {
            await producer.connect();
            await producer.send({
            topic: topic,
            messages: [{
                ...message,
                value: JSON.stringify(message.value),
                }],
            })
        }
        catch (error) {
            await producer.disconnect();
            return HandlerError.badRequest("[Kafka send]","[Kafka]: "+error);
        } 


        await producer.disconnect();
        return true;
    }



    async subscribe (config: ConsumerConfig, topics:string[], handlerMessages: Array<HandlerMessage>, fromBeginning = false){
        if(!topics || !handlerMessages) 
            return HandlerError.badRequest("[Kafka sub]","[Kafka]: sub args is BAD!");
        if(topics.length !== handlerMessages.length) 
            return HandlerError.badRequest("[Kafka sub]","[Kafka]: count of topics and function handler is not equal!");

        config = Object.assign({
            groupId: "user-group",
            heartbeatInterval:1000 
        },config);


        const consumer = kafka.consumer(config);

        try{
            await consumer.connect();
            await consumer.subscribe({ topics: topics, fromBeginning: fromBeginning });
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    let parse_headers = message?.headers;
                    if(parse_headers){
                        for(let key in parse_headers){
                            if (parse_headers.hasOwnProperty(key)) {
                                parse_headers[key] = parse_headers[key]?.toString();
                            }
                        }
                    }

                    const res:HandlerMessageArg=Object.assign({},{
                        topic:topic,
                        partition:partition,
                        message: {
                            ...message,
                            value: message.value ? JSON.parse(message.value.toString()) : '',
                            key: message.key?.toString(),
                            headers: parse_headers
                        } as Message
                    });
                    

                    let index = topics.indexOf(topic);
                    if( index !== -1)
                        await handlerMessages[index](res);
                },
            });
        }catch(error){
            await consumer.disconnect();
            return HandlerError.badRequest("[Kafka send]","[Kafka]: "+error);
        }

        await consumer.disconnect();
        return true;
    }
    
}

export default new CustomKafka;