import {Request, Response, NextFunction} from "express";

import { Setting } from "../models/user/Setting";
import HandlerError from "../error";



class SettingController{


    async get(req:Request, res:Response, next:NextFunction){
        const {email, phone, tokens} = req.body;
        let {user, setting} = req.body;
        
        if(!(email || phone) || !tokens)
            next(HandlerError.badRequest("[Setting get]","Bad args!"));
        if(!user || !setting)
            next(HandlerError.badRequest("[Setting get]","Have not the user or user`s setting!"));

        res.json({access:tokens.access, user:user, setting:setting});
    }



    async update(req:Request, res: Response, next:NextFunction){
        const {email, phone, language, theme, tokens} = req.body;
        let {user,setting} = req.body;

        
        if(!(email || phone) || !language || !theme || !tokens)
            next(HandlerError.badRequest("[Setting update]","Bad args!"));
        if(!user || !setting)
            next(HandlerError.badRequest("[Setting update]","Have not the user or user`s setting!"));

        try{
            const updateSetting = await Setting.update({language,theme},{where:{id:setting.id}});
            res.json({access:tokens.access, user:user, setting:updateSetting});
        }catch(err){
            next(HandlerError.internal("[Setting update]",(err as Error).message));
        }
    }
}

export default new SettingController();