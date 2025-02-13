import {Request, Response, NextFunction} from "express";
import { Setting } from "../models/Setting";
import HandlerError from "../error";



export default async function findSettingWare(req:Request, res:Response, next:NextFunction){

    const {user} = req.body;
    if(!user)
        return next();

    try{
        const setting = await Setting.findOne({
            where:{userId: user.id}
        });

        if(setting)
            req.body.setting = setting;

        return next();
    }catch(err){
        return next(HandlerError.badRequest("[findSettingWare]", (err as Error).message));
    }
}