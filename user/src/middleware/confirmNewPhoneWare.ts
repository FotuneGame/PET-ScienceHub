import {Request, Response, NextFunction} from "express";
import {CodeRedisType} from "../utils/types";
import HandlerError from "../error";
import redis from "../redis";



export default async function confirmNewPhoneWare(req:Request, res:Response, next:NextFunction) {
    const {newPhone} = req.body;
    if(!(newPhone))
        return next(HandlerError.badRequest("[confirmNewPhoneWare]", "Bad args!"));

    try{
        const data = newPhone;
        const data_cash = await redis.isHas(data);
        if(!data_cash)
            return next(HandlerError.badRequest("[confirmNewPhoneWare]", "User was not start auth"));

        const info = await redis.get(data) as CodeRedisType;
        if(!Number(info.confirm))
            return next(HandlerError.badRequest("[confirmNewPhoneWare]", "User was not authed!"));
        
        req.body.contact = info.type;
        return next();
    }catch(err){
        return next(HandlerError.internal("[confirmNewPhoneWare]",(err as Error).message));
    }
}