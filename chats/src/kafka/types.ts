import { Message } from "kafkajs";

export type HandlerMessageArg = {
    topic: string,
    partition: number,
    message: Message
}
export type HandlerMessage = (message:HandlerMessageArg) => Promise<void>;