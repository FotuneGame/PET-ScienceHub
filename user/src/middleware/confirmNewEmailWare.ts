import {Request, Response, NextFunction} from "express";
import {CodeRedisType} from "../utils/types";
import HandlerError from "../error";
import redis from "../redis";



export default async function confirmNewEmailWare(req:Request, res:Response, next:NextFunction) {
    const {newEmail} = req.body;
    if(!(newEmail))
        return next(HandlerError.badRequest("[confirmNewEmailWare]", "Bad args!"));

    try{
        const data = newEmail;
        const data_cash = await redis.isHas(data);
        if(!data_cash)
            return next(HandlerError.badRequest("[confirmNewEmailWare]", "User was not start auth"));

        const info = await redis.get(data) as CodeRedisType;
        if(!Number(info.confirm))
            return next(HandlerError.badRequest("[confirmNewEmailWare]", "User was not authed!"));
        
        req.body.contact = info.type;
        return next();
    }catch(err){
        return next(HandlerError.internal("[confirmNewEmailWare]",(err as Error).message));
    }
}