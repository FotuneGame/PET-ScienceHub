import {Request, Response, NextFunction} from "express";
import {CodeRedisType} from "../utils/types";
import HandlerError from "../error";
import redis from "../redis";



export default async function confirmWare(req:Request, res:Response, next:NextFunction) {
    const {email, phone} = req.body;
    if(!(email || phone))
        next(HandlerError.badRequest("[confirmWare]", "Bad args!"));

    try{
        const data = phone ?? email;
        const data_cash = await redis.isHas(data);

        if(!data_cash)
            next(HandlerError.badRequest("[confirmWare]", "User was not start auth"));

        const info = await redis.get(data) as CodeRedisType;
        if(!Number(info.confirm))
            next(HandlerError.badRequest("[confirmWare]", "User was not authed!"));

        next();
    }catch(err){
        next(HandlerError.internal("[confirmWare]",(err as Error).message));
    }
}