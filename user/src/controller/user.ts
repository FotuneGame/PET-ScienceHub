import {Request, Response, NextFunction} from "express";
import {generateJWT, generateHash, equalsHash} from "../utils";

import { User } from "../models/user/User";
import { MetaUser } from "../models/user/MetaUser";
import { Setting } from "../models/user/Setting";
import { sendEmail } from "../email";
import { sendSMS } from "../phone";
import HandlerError from "../error";



class UserController{


    async get(req:Request, res:Response, next:NextFunction){
        const {id} = req.params;
        if(!Number(id))
            next(HandlerError.badRequest("[User get]","Bad id!"));

        try{
            const user = await User.findOne({where: {id}});
            const metaUser = await MetaUser.findOne({where: {userId:id}});
            res.json({user:user, metaUser:metaUser});
        }catch(err){
            next(HandlerError.internal("[User get]",(err as Error).message));
        }
    }



    async login(req:Request, res:Response, next:NextFunction){
        const {password, email, phone, name, adress, date, language, theme} = req.body;
        const {user} = req.body;
        let {metaUser, setting} = req.body;
        
        if(!password || !(email || phone) || !name || !adress || !date || !language || !theme)
            next(HandlerError.badRequest("[User login]","Bad args!"));
        if(!user)
            next(HandlerError.badRequest("[User login]","Have not this user!"));

        try{
            const compare = await equalsHash(password,user.password);
            if(!compare)
                return next(HandlerError.badRequest("[User login]","Not correct password!"));

            if(!metaUser)
                metaUser = await MetaUser.create({userId:user.id, lastPlaceIn:adress, lastTimeIn: date});
            if(!setting)
                setting = await Setting.create({userId:user.id,language:language,theme:theme});
            
            const access = generateJWT({id:user.id,name:user.name,password:user.password}, false);
            const refresh = generateJWT({id:user.id,name:user.name,password:user.password}, true);
    
            res.cookie("refresh",refresh,{httpOnly: false, secure: false, signed: false});
            res.json({access,user:user, metaUser:metaUser, setting: setting});
        }catch(err){
            next(HandlerError.internal("[User login]",(err as Error).message));
        }
    }



    async registration(req:Request, res:Response, next:NextFunction){
        const {password, email, phone, name, adress, date, language, theme} = req.body;
        let {user,metaUser,setting} = req.body;

        
        if(!password || !(email || phone) || !name || !adress || !date || !language || !theme)
            next(HandlerError.badRequest("[User registration]","Bad args!"));
        if(user)
            next(HandlerError.badRequest("[User registration]","User is used!"));

        try{
            const passwordHash = await generateHash(password);
            user = await User.create({password:passwordHash,email:email,phone:phone,name:name});
            metaUser = await MetaUser.create({userId:user.id,lastPlaceIn:adress, lastTimeIn: date});
            setting = await Setting.create({userId:user.id,language:language,theme:theme});

            const access = generateJWT({id:user.id,name:user.name,password:user.password}, false);
            const refresh = generateJWT({id:user.id,name:user.name,password:user.password}, true);
    
            res.cookie("refresh",refresh,{httpOnly: false, secure: false, signed: false});
            res.json({access,user:user,metaUser:metaUser,setting:setting});
        }catch(err){
            next(HandlerError.internal("[User registration]",(err as Error).message));
        }
    }



    async delete(req:Request, res:Response, next:NextFunction){
        const {password, tokens} = req.body;
        const {user, metaUser, setting} = req.body;
        
        if(!password || !tokens)
            next(HandlerError.badRequest("[User delete]","Bad args!"));
        if(!user || !metaUser || !setting)
            next(HandlerError.badRequest("[User delete]","Have not this user!"));

        try{
            const compare = await equalsHash(password,user.password);
            if(!compare)
                next(HandlerError.badRequest("[User delete]","Not correnct password!"));
            
            await MetaUser.destroy({where:{id:metaUser.id}});
            await Setting.destroy({where:{id:setting.id}});
            await User.destroy({where:{id:user.id}});

            res.json({user:user,metaUser:metaUser,setting:setting});
        }catch(err){
            next(HandlerError.internal("[User delete]", (err as Error).message));
        }
    }



    async setPassword(req:Request, res:Response, next:NextFunction){
        const {password, tokens} = req.body;
        const {user, metaUser, setting} = req.body;

        if(!password || !tokens)
            next(HandlerError.badRequest("[User setPassword]","Bad args!"));
        if(!user)
            next(HandlerError.badRequest("[User setPassword]","Have not this user!"));

        try{
            const compare = await equalsHash(password,user.password);
            if(!compare)
                next(HandlerError.badRequest("[User setPassword]","Not correnct password!"));
            const passwordHash = await generateHash(password);
            const updateUser = await User.update({password:passwordHash},{where:{id:user.id}});
            res.json({access: tokens.access,user:updateUser,metaUser:metaUser,setting:setting});
        }catch(err){
            next(HandlerError.internal("[User setPassword]", (err as Error).message));
        }
    }



    async setEmail(req:Request, res:Response, next:NextFunction){
        const {email, tokens} = req.body;
        const {user, metaUser, setting} = req.body;

        if(!email || !tokens)
            next(HandlerError.badRequest("[User setEmail]","Bad args!"));
        if(!user)
            next(HandlerError.badRequest("[User setEmail]","Have not this user!"));

        try{
            const updateUser = await User.update({email:email},{where:{id:user.id}});
            res.json({access: tokens.access,user:updateUser,metaUser:metaUser,setting:setting});
        }catch(err){
            next(HandlerError.internal("[User setEmail]", (err as Error).message));
        }
    }



    async setPhone(req:Request, res:Response, next:NextFunction){
        const {phone, tokens} = req.body;
        const {user, metaUser, setting} = req.body;

        if(!phone || !tokens)
            next(HandlerError.badRequest("[User setPhone]","Bad args!"));
        if(!user)
            next(HandlerError.badRequest("[User setPhone]","Have not this user!"));

        try{
            const updateUser = await User.update({phone:phone},{where:{id:user.id}});
            res.json({access: tokens.access,user:updateUser,metaUser:metaUser,setting:setting});
        }catch(err){
            next(HandlerError.internal("[User setPhone]", (err as Error).message));
        }
    }



    async message(req:Request, res:Response, next:NextFunction){
        const {code, contact} = req.body;
        if(!code || !contact)
            next(HandlerError.badRequest("[User message]","Bad args!"));

        switch(contact){
            case "email": next(await sendEmail(code,contact)); break;
            case "phone": next(await sendSMS(code, contact)); break;
        }
    }
}

export default new UserController();