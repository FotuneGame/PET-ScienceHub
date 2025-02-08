export type JWTType = {
    id:number, 
    name:string, 
    password:string
}

export type CodeRedisType = {
    code: string,
    time: string,
    confirm: string
}