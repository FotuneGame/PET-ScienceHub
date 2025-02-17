import redisConnection from "./redis";
import HandlerError from "../error";

class CustomRedis{



    async get(key: string){
        if(!key)
            return HandlerError.badRequest("[Redis get]","Args is BAD!");

        const redis = await redisConnection();

        try{
            const result = await redis.hGetAll(key);
            return result;
        }catch(err){
            return HandlerError.badRequest("[Redis get]","Cannot HGETALL, show more: " + err + "\n[Redis]" + redis);
        }finally{
            await redis.quit();
        }
    }



    async set(key: string,field: string, value: string){
        if(!key || !field || !value)
            return HandlerError.badRequest("[Redis set]","Args is BAD!");

        const redis = await redisConnection();
        try{
            const result = await redis.hSet(key, field, value);
            const seconds = Number(process.env.CODE_CONFIRM_ACTIVITY_MINUNTE) * 60 || 30*60;
            await redis.expire(key, seconds);
            return result;
        }catch(err){
            return HandlerError.badRequest("[Redis set]","Cannot HSET, show more: " + err + "\n[Redis]" + redis);
        }finally{
            await redis.quit();
        }
    }



    async isHas(key: string){
        if(!key)
            return HandlerError.badRequest("[Redis iHas]","Args is BAD!");

        const redis = await redisConnection();

        try{
            const result = await redis.EXISTS(key);
            return result;
        }catch(err){
            return HandlerError.badRequest("[Redis  isHas]","Cannot EXISTS, show more: " + err + "\n[Redis]" + redis);
        }finally{
            await redis.quit();
        }
    }


    
    async clearDBCashe(){
        const redis = await redisConnection();

        try{
            const result = await redis.flushDb();
            return result;
        }catch(err){
            return HandlerError.badRequest("[Redis  clearAllCash]","Cannot FLUSHDB, show more: " + err + "\n[Redis]" + redis);
        }finally{
            await redis.quit();
        }
    }

}

export default new CustomRedis;