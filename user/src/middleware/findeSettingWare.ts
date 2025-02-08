import {Request, Response, NextFunction} from "express";
import { Setting } from "../models/user/Setting";
import HandlerError from "../error";



export default async function findSettingWare(req:Request, res:Response, next:NextFunction){

    const {user} = req.body;
    if(!user)
        next();

    try{
        const setting = await Setting.findOne({
            where:{userId: user.id}
        });

        if(setting)
            req.setting = setting;

        next();
    }catch(err){
        next(HandlerError.badRequest("[findSettingWare]", (err as Error).message));
    }
}