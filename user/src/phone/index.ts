import HandlerError from "../error";
import {data} from "./data";
import axios from "axios";





export async function sendSMS(code: number, phone: string, callback: ()=>void){

    try{
        await axios.post(data.url,{
          number: process.env.PHONE,
          destination: phone,
          text: data.text + code
        },{
          headers: {'Authorization': 'Bearer ' + process.env.PHONE_KEY}
        })
        callback();
        return;
    }catch(err){
        return HandlerError.internal("[Phone send]",(err as Error).message);
    }
}