class HandlerError extends Error{
  
    status: number;

    constructor(status:number,name:string,message:string) {
        super();
        this.status=status;
        this.name = name;
        this.message=message;
    }

    static badRequest(name:string,message:string){
        return new HandlerError(404,name,message)
    }

    static internal(name:string,message:string){
        return new HandlerError(500,name,message)
    }

    static forbidden(name:string,message:string){
        return new HandlerError(403,name,message)
    }

    static noUploadFile(name:string,message:string){
        return new HandlerError(400,name,message)
    }
}

export default HandlerError;