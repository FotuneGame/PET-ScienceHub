import nodemailer from "nodemailer";
import HandlerError from "../error";
import { mailBody } from "./data";



const transporter=nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASSWORD
    }
});



export async function sendEmail(code: number, email: string){
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to: email,
        headers: mailBody.headers as any,
        subject: mailBody.subject,
        text: mailBody.text,
        html: mailBody.html(code)
    }

    try{
        return await transporter.sendMail(mailOptions,(err)=>{
            if(err)
                return HandlerError.internal("[Mail send]",err.message);
        });
    }catch(err){
        return HandlerError.internal("[Mail send]",(err as Error).message);
    }
}