import HandlerError from "../error";



export async function sendSMS(code: number, phone: string, callback: ()=>void){

    try{
        callback();
        return;
    }catch(err){
        return HandlerError.internal("[Phone send]",(err as Error).message);
    }
}