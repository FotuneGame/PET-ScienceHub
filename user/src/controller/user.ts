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
            return next(HandlerError.badRequest("[User get]","Bad id!"));

        try{
            const user = await User.findOne({where: {id}});
            const metaUser = await MetaUser.findOne({where: {userId:id}});
            if(user)
                user.password="";
            res.json({user:user, metaUser:metaUser});
        }catch(err){
            return next(HandlerError.internal("[User get]",(err as Error).message));
        }
    }



    async login(req:Request, res:Response, next:NextFunction){
        const {password, email, phone, adress, date} = req.body;
        const {user} = req.body;
        let {metaUser, setting} = req.body;
        
        if(!password || !(email || phone) || !adress || !date)
            return next(HandlerError.badRequest("[User login]","Bad args!"));
        if(!user)
            return next(HandlerError.badRequest("[User login]","Have not this user!"));

        try{
            const compare = await equalsHash(password,user.password);
            if(!compare)
                return next(HandlerError.badRequest("[User login]","Not correct password!"));

            if(!metaUser)
                metaUser = await MetaUser.create({userId:user.id, lastPlaceIn:adress, lastTimeIn: date});
            else
                metaUser = await MetaUser.update({lastPlaceIn:adress, lastTimeIn: date},{where:{id:metaUser.id}});

            if(!setting)
                setting = await Setting.create({userId:user.id});
            
            const access = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, false);
            const refresh = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, true);

            if(user)
                user.password="";
            res.cookie("refresh",refresh,{httpOnly: false, secure: false, signed: false});
            res.json({access,user:user, metaUser:metaUser, setting: setting});
        }catch(err){
            return next(HandlerError.internal("[User login]",(err as Error).message));
        }
    }



    async registration(req:Request, res:Response, next:NextFunction){
        const {password, email, phone, name, adress, date, language, theme} = req.body;
        let {user} = req.body;

        
        if(!password || !(email || phone) || !name || !adress || !date)
            return next(HandlerError.badRequest("[User registration]","Bad args!"));
        if(user)
            return next(HandlerError.badRequest("[User registration]","User is used!"));

        try{
            const passwordHash = await generateHash(password);
            user = await User.create({password:passwordHash,email:email,phone:phone,name:name});
            const metaUser = await MetaUser.create({userId:user.id,lastPlaceIn:adress, lastTimeIn: date});
            const setting = await Setting.create({userId:user.id,language:language,theme:theme});

            const access = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, false);
            const refresh = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, true);
            
            if(user)
                user.password="";
            res.cookie("refresh",refresh,{httpOnly: false, secure: false, signed: false});
            res.json({access,user:user,metaUser:metaUser,setting:setting});
        }catch(err){
            return next(HandlerError.internal("[User registration]",(err as Error).message));
        }
    }



    async delete(req:Request, res:Response, next:NextFunction){
        const {tokens} = req.body;
        const {user, metaUser, setting} = req.body;

        if(!tokens)
            return next(HandlerError.badRequest("[User delete]","Bad args!"));
        if(!user || !metaUser || !setting)
            return next(HandlerError.badRequest("[User delete]","Have not this user!"));

        try{
            
            await MetaUser.destroy({where:{id:metaUser.id}});
            await Setting.destroy({where:{id:setting.id}});
            await User.destroy({where:{id:user.id}});
            
            if(user)
                user.password="";
            res.json({user:user,metaUser:metaUser,setting:setting});
        }catch(err){
            return next(HandlerError.internal("[User delete]", (err as Error).message));
        }
    }



    async setPassword(req:Request, res:Response, next:NextFunction){
        const {password, tokens} = req.body;
        const {user, metaUser, setting} = req.body;

        if(!password || !tokens)
            return next(HandlerError.badRequest("[User setPassword]","Bad args!"));
        if(!user)
            return next(HandlerError.badRequest("[User setPassword]","Have not this user!"));

        try{
            const passwordHash = await generateHash(password);
            const updateUser = await User.update({password:passwordHash},{where:{id:user.id}});
            const newUser = await User.findOne({where:{id:user.id}});
            if(newUser)
                newUser.password="";
            res.json({access: tokens.access,user:newUser,metaUser:metaUser,setting:setting});
        }catch(err){
            return next(HandlerError.internal("[User setPassword]", (err as Error).message));
        }
    }



    async setEmail(req:Request, res:Response, next:NextFunction){
        const {newEmail, contact} = req.body;
        const {user, metaUser, setting} = req.body;

        if(!newEmail || !contact || contact!="email")
            return next(HandlerError.badRequest("[User setEmail]","Bad args!"));
        if(!user)
            return next(HandlerError.badRequest("[User setEmail]","Have not this user!"));

        try{
            const updateUser = await User.update({email:newEmail},{where:{id:user.id}});
            const newUser = await User.findOne({where:{id:user.id}});

            const access = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, false);
            const refresh = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, true);
            if(newUser)
                newUser.password="";
            res.cookie("refresh",refresh,{httpOnly: false, secure: false, signed: false});
            res.json({access,user:newUser,metaUser:metaUser,setting:setting});
        }catch(err){
            return next(HandlerError.internal("[User setEmail]", (err as Error).message));
        }
    }



    async setPhone(req:Request, res:Response, next:NextFunction){
        const {newPhone, contact} = req.body;
        const {user, metaUser, setting} = req.body;

        if(!newPhone || !contact || contact!="phone")
            return next(HandlerError.badRequest("[User setPhone]","Bad args!"));
        if(!user)
            return next(HandlerError.badRequest("[User setPhone]","Have not this user!"));

        try{
            const updateUser = await User.update({phone:newPhone},{where:{id:user.id}});
            const newUser = await User.findOne({where:{id:user.id}});

            const access = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, false);
            const refresh = generateJWT({id:user.id,name:user.name,password:user.password, email:user.email, phone:user.phone}, true);
            if(newUser)
                newUser.password="";
            res.cookie("refresh",refresh,{httpOnly: false, secure: false, signed: false});
            res.json({access,user:newUser,metaUser:metaUser,setting:setting});
        }catch(err){
            return next(HandlerError.internal("[User setPhone]", (err as Error).message));
        }
    }



    async refresh(req:Request, res:Response, next:NextFunction){
        const {tokens} = req.body;
        if(!tokens)
            return next(HandlerError.badRequest("[User refresh]","Have NOT tokens!"));
        res.json({access: tokens.access});
    }


    
    async confirm(req:Request, res:Response, next:NextFunction){
        const {contact} = req.body;

        if(!contact)
            return next(HandlerError.badRequest("[User confirm]","Cannot understand contact for confirm!"));

        res.json({confirm:true});
    }
    

    
    async message(req:Request, res:Response, next:NextFunction){
        const {code, contact, email, phone} = req.body;
        if(!code || !contact)
            return next(HandlerError.badRequest("[User message]","Bad args!"));
        
        try{
            switch(contact){
                case "email": 
                    return next(await sendEmail(code, email,()=>res.json({send:true}) ));
                case "phone": 
                    return next(await sendSMS(code, phone, ()=>res.json({send:true}) ));
            }
        }catch(err){
            return next(HandlerError.internal("[User message]", (err as Error).message));
        }
    }
}

export default new UserController();