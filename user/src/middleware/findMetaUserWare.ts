import {Request, Response, NextFunction} from "express";
import { MetaUser } from "../models/user/MetaUser";
import HandlerError from "../error";



export default async function findMetaUserWare(req:Request, res:Response, next:NextFunction){

    const {user} = req.body;
    if(!user)
        next();

    try{
        const metaUser = await MetaUser.findOne({
            where:{userId: user.id}
        });

        if(metaUser)
            req.metaUser = metaUser;

        next();
    }catch(err){
        next(HandlerError.badRequest("[findMetaUserWare]", (err as Error).message));
    }
}