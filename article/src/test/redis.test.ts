import "dotenv/config";
import assert from "assert";
import CustomRedis from "../redis";
import HandlerError from "../error";

describe("Redis tests", ()=>{
    it("Set", async () =>{
        console.log("[Redis]: ",`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`);
        const result = await CustomRedis.set("key","field","value");
        assert.equal(result, 1);
    }).timeout(15000);
    it("Get", async () =>{
        console.log("[Redis]: ",`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`);
        const result = await CustomRedis.get("key");
    
        assert.equal((result as any)?.field, "value");
    }).timeout(15000);
    it("isHas", async () =>{
        console.log("[Redis]: ",`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`);
        const result = await CustomRedis.isHas("key");
        assert.equal(result, 1);
    }).timeout(15000);
    it("clearDBCashe", async () =>{
        console.log("[Redis]: ",`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`);
        const result = await CustomRedis.clearDBCashe();
        assert.equal(result, "OK");
    }).timeout(15000);
});