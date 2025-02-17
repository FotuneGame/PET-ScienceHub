import { JWTType } from "./types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import HandlerError from "../error";



export const generateJWT=(data:JWTType, isRefresh: boolean)=>{
    const salt = process.env.SECRET_KEY || "SALT"
    return jwt.sign(data, salt, {expiresIn: isRefresh ? "90d" : "15m"});
}

export const verifyJWT=(token:string)=>{
    const salt = process.env.SECRET_KEY || "SALT"
    let res;
    jwt.verify(token, salt, (err,decoded)=>{
        if(err)
            res = HandlerError.internal("[verifyJWT]",err.message);
        res = decoded;
    });
    return res
}

export const generateHash = async (value:string) =>{
    const depth = Number(process.env.DEPTH_HASH) || 3;
    const salt = await bcrypt.genSalt(depth);
    return await bcrypt.hash(value, salt);
}

export const equalsHash = async (value:string, value2: string) =>{
    return await bcrypt.compare(value, value2);
}