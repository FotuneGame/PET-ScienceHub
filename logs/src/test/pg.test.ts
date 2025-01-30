import "dotenv/config";
import sequelize from "../db";
import assert from "assert";
import sinon from "sinon";



describe("PostgreeSQL tests", () => {
  it("Sync and auth", async () => {
    console.log("[PG sync/auth]: ",process.env.DB_HOST,':',process.env.DB_PORT);
    await sequelize.authenticate();
    await sequelize.sync();
  }).timeout(15000);
 });