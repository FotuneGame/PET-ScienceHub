import {Request, Response, NextFunction} from "express";
import {CodeRedisType} from "../utils/types";
import HandlerError from "../error";
import redis from "../redis";



export default async function generationCodeWare(req:Request, res:Response, next:NextFunction) {
    const {email, phone} = req.body;
    if(!(email || phone))
        return next(HandlerError.badRequest("[generationCodeWare]", "Bad args!"));
    try{
        const data = phone || email;
        const code = Math.floor(100000+Math.random()*900000);
        req.body.code = code;
        await redis.set(data, "code", code.toString());
        await redis.set(data, "time", new Date().getTime().toString());
        await redis.set(data, "confirm", "0");
        if(phone){
            await redis.set(data, "type", "phone");
            req.body.contact = "phone";
        }else{
            await redis.set(data, "type", "email");
            req.body.contact = "email";
        }
        return next();
    }catch(err){
        return next(HandlerError.internal("[generationCodeWare]",(err as Error).message));
    }
}