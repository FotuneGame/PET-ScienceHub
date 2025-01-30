import express, {Router} from "express";

const router:Router = express.Router();



// THIS IS TEST CODE, PLEASE DELETE AND CREATE NORMAL ROUTE :)
import {Request, Response, NextFunction} from "express";
router.get("/", (req:Request, res:Response, next:NextFunction) => {    
    res.json( {
        info: "[Repa] Date:" + new Date().toDateString() + new Date().getTime().toString()
    });
    next();
});
// TEST CODE IS UP ^_^



export default router;