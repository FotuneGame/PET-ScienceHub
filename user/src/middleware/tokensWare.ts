import {Request, Response, NextFunction} from "express";
import {generateJWT,verifyJWT} from "../utils";
import {JWTType} from "../utils/types";
import HandlerError from "../error";



export default async function tokensWare(req:Request, res:Response, next:NextFunction) {
    const access = req.headers.authorization;
    const {refresh} = req.cookies;
    if(!access || !refresh)
        return next(HandlerError.badRequest("[tokensWare]","Bad args!"));

    const token= (access as string).split(" ")[1]; // Bearer token_hash

    try{
        const decoded_access = verifyJWT(token);
        const decoded_refresh = verifyJWT(refresh);
    
        if(!decoded_refresh)
            return next(HandlerError.badRequest("[tokensWare]","Refresh token is old or not have!"));
        
        if(JSON.stringify(decoded_access) === JSON.stringify(decoded_refresh))
            req.body.tokens = {
                access: token,
                refresh: refresh as string,
                body: decoded_refresh as JWTType
            }
        else{
            const decoded = (decoded_refresh as JWTType);
            const data:JWTType = {
                id: decoded.id,
                name: decoded.name,
                password: decoded.password,
                email: decoded.email,
                phone: decoded.phone
            }
            const new_access = generateJWT(data,false);
            req.body.tokens = {
                access: new_access,
                refresh: refresh as string,
                body: data
            }
        }
        
        req.body.email = req.body.tokens.body.email;
        req.body.phone = req.body.tokens.body.phone;
    
        return next();
    }catch(err){
        return next(HandlerError.internal("[tokensWare]",(err as Error).message));
    }
}