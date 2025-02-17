import {Request, Response, NextFunction} from "express";
import { MetaUser } from "../models/MetaUser";
import { Setting } from "../models/Setting";
import { User } from "../models/User";
import {generateJWT} from "../utils";
import HandlerError from "../error";
import sequelize from "../db";



class GitHubController{

     async sign(req:Request, res:Response, next:NextFunction) {
        const data:any = req.user;

        if(!(data))
            return next(HandlerError.badRequest("[GitHubController sign]", "Bad args!"));

        const trans = await sequelize.transaction();
    
        try{
            const name = data.displayName;
            let user = await User.findOne({where:{name,social:"github"}});
            if(!user)
                user = await User.create({name:name, social: "github"}, { transaction: trans });
            
            let metaUser = await MetaUser.findOne({where:{userId:user.id}});
            if(!metaUser)
                metaUser = await MetaUser.create({userId:user.id, lastPlaceIn: "github", lastTimeIn: new Date().toDateString()}, { transaction: trans });
    
            let setting = await Setting.findOne({where:{userId:user.id}});
            if(!setting)
                setting = await Setting.create({userId:user.id}, { transaction: trans });

            await trans.commit();
            
            const access = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, false);
            const refresh = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, true);
    
            res.cookie("refresh",refresh,{httpOnly: false, secure: false, signed: false});
            res.json({access,user:user, metaUser:metaUser, setting: setting});
        }catch(err){
            await trans.rollback();
            return next(HandlerError.internal("[GitHubController sign]",(err as Error).message));
        }
    }


    
    async fail(req:Request, res:Response, next:NextFunction) {
        res.json({sign:false});
    }
}


export default new GitHubController();