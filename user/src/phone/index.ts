import HandlerError from "../error";



export async function sendSMS(code: number, email: string){

    try{
        return;
    }catch(err){
        return HandlerError.internal("[Phone send]",(err as Error).message);
    }
}