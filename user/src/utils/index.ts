import { JWTType } from "./types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



export const generateJWT=(data:JWTType, isRefresh: boolean)=>{
    const salt = process.env.SECRET_KEY ?? "SALT"
    return jwt.sign(data, salt, {expiresIn: isRefresh ? "90d" : "15m"});
}

export const generateHash = async (value:string) =>{
    const depth = process.env.DEPTH_HASH ?? 3;
    return await bcrypt.hash(value,depth);
}

export const equalsHash = async (value:string, value2: string) =>{
    return await bcrypt.compare(value, value2);
}