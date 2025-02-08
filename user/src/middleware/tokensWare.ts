import {Request, Response, NextFunction} from "express";
import {generateJWT} from "../utils";
import {JWTType} from "../utils/types";
import jwt from "jsonwebtoken";
import HandlerError from "../error";



export default async function tokensWare(req:Request, res:Response, next:NextFunction) {
    const {access} = req.headers;
    const {refresh} = req.cookies.get("refresh");
    if(!access || !refresh)
        next(HandlerError.badRequest("[tokensWare]","Bad args!"));

    const token= (access as string).split(" ")[1]; // Bearer token_hash
    const salt = process.env.SECRET_KEY ?? "SALT";
    const decoded_access = jwt.verify(token,salt);
    const decoded_refresh = jwt.verify(refresh,salt);

    if(!decoded_refresh)
        next();
    
    if(JSON.stringify(decoded_access) === JSON.stringify(decoded_refresh))
        req.tokens = {
            access: token,
            refresh: refresh as string,
            body: decoded_refresh as JWTType
        }
    else{
        const new_access = generateJWT((decoded_refresh as JWTType),false);
        req.tokens = {
            access: new_access,
            refresh: refresh as string,
            body: decoded_refresh as JWTType
        }
    }

    next();
}