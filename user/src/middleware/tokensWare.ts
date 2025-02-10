import {Request, Response, NextFunction} from "express";
import {generateJWT} from "../utils";
import {JWTType} from "../utils/types";
import jwt from "jsonwebtoken";
import HandlerError from "../error";



export default async function tokensWare(req:Request, res:Response, next:NextFunction) {
    const access = req.headers.authorization;
    const {refresh} = req.cookies;
    if(!access || !refresh)
        return next(HandlerError.badRequest("[tokensWare]","Bad args!"));

    const token= (access as string).split(" ")[1]; // Bearer token_hash
    const salt = process.env.SECRET_KEY ?? "SALT";
    const decoded_access = jwt.verify(token,salt);
    const decoded_refresh = jwt.verify(refresh,salt);

    if(!decoded_refresh)
        return next(HandlerError.badRequest("[tokensWare]","Refresh token is old or not have!"));
    
    if(JSON.stringify(decoded_access) === JSON.stringify(decoded_refresh))
        req.body.tokens = {
            access: token,
            refresh: refresh as string,
            body: decoded_refresh as JWTType
        }
    else{
        const new_access = generateJWT((decoded_refresh as JWTType),false);
        req.body.tokens = {
            access: new_access,
            refresh: refresh as string,
            body: decoded_refresh as JWTType
        }
    }
    
    req.body.email = req.body.tokens.email;
    req.body.phone = req.body.tokens.phone;

    return next();
}