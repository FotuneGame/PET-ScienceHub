import {Request, Response, NextFunction} from "express";
import validator from "validator";

import { Setting } from "../models/Setting";
import HandlerError from "../error";



class SettingController{


    async get(req:Request, res:Response, next:NextFunction){
        const {id} = req.params;
        if(!Number(id))
            return next(HandlerError.badRequest("[Setting get]","Bad id!"));
        
        try{
            const setting = await Setting.findOne({where: {userId:id}});
            res.json({setting:setting});
        }catch(err){
            return next(HandlerError.internal("[Setting get]",(err as Error).message));
        }
    }



    async update(req:Request, res: Response, next:NextFunction){
        const {email, phone, language, theme, tokens} = req.body;
        let {user,setting} = req.body;

        
        if(!(email || phone) || !language || !theme || !tokens)
            return next(HandlerError.badRequest("[Setting update]","Bad args!"));
        if(!user || !setting)
            return next(HandlerError.badRequest("[Setting update]","Have not the user or user`s setting!"));
        if(!(validator.isEmail(email) || validator.isMobilePhone(phone)) || !validator.isISO6391(language) || !Number(theme) || Number(theme)<0)
            return next(HandlerError.badRequest("[Setting update]","Bad args, not validating!"));

        try{
            const updateSetting = await Setting.update({language,theme},{where:{id:setting.id}});
            const newSetting = await Setting.findOne({where:{id:setting.id}})
            res.json({access:tokens.access, user:user, setting:newSetting});
        }catch(err){
            return next(HandlerError.internal("[Setting update]",(err as Error).message));
        }
    }
}

export default new SettingController();