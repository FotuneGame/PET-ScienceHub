import "dotenv/config";
import express, { Express } from "express";
import fileUpload from "express-fileupload";
import cookieParser from 'cookie-parser';
import session from "express-session";
import {ware} from "./middleware/";
import HandlerError from "./error";
import passport from "./passport";
import CustomKafka from "./kafka";
import CustomRedis from "./redis";
import {logger} from "./logs";
import router from "./router";
import sequelize from "./db";
import path from "path";
import cors from "cors";



const PORT = process.env.PORT || 3001
const ULR_CORS = process.env.URL_CORS || ["http://localhost:3000"]



const app:Express = express();

app.use(cors({
    origin: function (origin,callback){
        if(!origin || origin && ULR_CORS.includes(origin))
            callback(null,true);
        else
            callback(HandlerError.badRequest("CORS","Not allowed by CORS"));
    },
    allowedHeaders:['Authorization','Content-Type']
}));


app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY || "SALT",
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
    }
}));
app.use(express.json())
app.use("/static",express.static(path.join(__dirname,'..', 'public')));
app.use(fileUpload({createParentPath: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/",router);
app.use(ware.errorWare);



app.listen(PORT, async ()=>{
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        console.log(`[user]: User is running at http://localhost:`+PORT);
        logger.info("[user]: User is running PORT: "+PORT);
    }catch(err){
        console.log(`[user]: Error: `, err);
        logger.error("[user]: User is NOT running. Error: "+err);
    }
})