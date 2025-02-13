import {Request, Response, NextFunction} from "express";
import { MetaUser } from "../models/MetaUser";
import HandlerError from "../error";



export default async function findMetaUserWare(req:Request, res:Response, next:NextFunction){

    const {user} = req.body;
    if(!user)
        return next();

    try{
        const metaUser = await MetaUser.findOne({
            where:{userId: user.id}
        });

        if(metaUser)
            req.body.metaUser = metaUser;

        return next();
    }catch(err){
        return next(HandlerError.badRequest("[findMetaUserWare]", (err as Error).message));
    }
}