import { Request, Response,NextFunction } from "express";
import HandlerError from "../error";


export default function (err: Error,req:Request,res:Response,next:NextFunction){
    if(err instanceof HandlerError)
        res.status((err as HandlerError).status).json({message:err.message,name:err.name});
    else
        res.status(500).json({message:"We don`t know what is it error on server"});
}