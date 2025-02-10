export type JWTType = {
    id:number, 
    name:string, 
    password:string,
    email:string,
    phone:string
}

export type ContactType = "email" | "phone";

export type CodeRedisType = {
    code: string,
    time: string,
    confirm: string,
    type: ContactType
}