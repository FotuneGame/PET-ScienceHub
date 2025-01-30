import {createClient} from "redis";

const setting = {
    name:process.env.REDIS_NAME,
    password:process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB // 0-15 count
}

const redisConnection = async () =>{
    
    let url = `redis://${setting.host}:${setting.port}/${setting.db}`;
    if(setting.name && setting.password)
        url = `redis://${setting.name}:${setting.password}@${setting.host}:${setting.port}/${setting.db}`

    return await createClient({url})
    .on("error", (error) => {
        return error;
    })
    .connect();
};

export default redisConnection;