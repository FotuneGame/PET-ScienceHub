import { Request, Response,NextFunction } from "express";
import HandlerError from "../error";
import {logger} from "../logs";



export default function (err: Error,req:Request,res:Response,next:NextFunction){
    if(err instanceof HandlerError){
        res.status((err as HandlerError).status).json({message:err.message,name:err.name});
        logger.error({status:(err as HandlerError).status,message:err.message,name:err.name});
    }else{
        res.status(500).json({message:"We don`t know what is it error on server: "+ err});
        logger.error({status:500,message:"We don`t know what is it error on server: "+ err,name:err.name});
    }
}