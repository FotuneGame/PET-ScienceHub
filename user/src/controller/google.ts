import {Request, Response, NextFunction} from "express";
import { MetaUser } from "../models/MetaUser";
import { Setting } from "../models/Setting";
import { User } from "../models/User";
import {generateJWT} from "../utils";
import HandlerError from "../error";

class GoogleController{

     async sign(req:Request, res:Response, next:NextFunction) {
        const data:any = req.user;

        if(!(data))
            return next(HandlerError.badRequest("[GoogleController sign]", "Bad args!"));
    
        try{
            const name = data.displayName;
            let user = await User.findOne({where:{name,social:"google"}});
            if(!user)
                user = await User.create({name:name, social: "google"});
            
            let metaUser = await MetaUser.findOne({where:{userId:user.id}});
            if(!metaUser)
                metaUser = await MetaUser.create({userId:user.id, lastPlaceIn: "google", lastTimeIn: new Date().toDateString()});
    
            let setting = await Setting.findOne({where:{userId:user.id}});
            if(!setting)
                setting = await Setting.create({userId:user.id});
            
            const access = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, false);
            const refresh = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, true);
    
            res.cookie("refresh",refresh,{httpOnly: false, secure: false, signed: false});
            res.json({access,user:user, metaUser:metaUser, setting: setting});
        }catch(err){
            return next(HandlerError.internal("[GoogleController sign]",(err as Error).message));
        }
    }


    
    async fail(req:Request, res:Response, next:NextFunction) {
        res.json({sign:false});
    }
}


export default new GoogleController();