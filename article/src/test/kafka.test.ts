import "dotenv/config";
import type {HandlerMessageArg} from "../kafka/types";
import CustomKafka from "../kafka/";
import assert from "assert";
import sinon from "sinon";


describe("Kafka tests", () => {

  it("Create Topic", async () => {
    console.log("[Kafka createTopic]: ",[process.env.KAFKA_BROCKERS_HOST+":"+process.env.KAFKA_BROCKERS_PORT]);
    const result = await CustomKafka.createTopic("user");
    assert.equal(result, true);
  }).timeout(15000);

  it("Send", async () => {
    console.log("[Kafka send]: ",[process.env.KAFKA_BROCKERS_HOST+":"+process.env.KAFKA_BROCKERS_PORT]);
    const result = await CustomKafka.send("user",{value:'text some',headers:{"some_headers":"some-value"}});
    assert.equal(result, true);
  }).timeout(15000);

  it("Subscribe", async () => {
    console.log("[Kafka sub]: ",[process.env.KAFKA_BROCKERS_HOST+":"+process.env.KAFKA_BROCKERS_PORT]);
    const result = await CustomKafka.subscribe({groupId:"user-group"},["user"],[async (arg:HandlerMessageArg)=>{
      console.log(arg);
      assert.equal(arg.topic, "user");
      assert.equal(arg.message.value, "text some");
      assert.equal(arg.message?.headers?.some_headers, "some-value");
    }]);
  }).timeout(15000);
 });