"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
/*
"target": "es6", // или более поздняя версия ECMAScript
"experimentalDecorators": true,
"emitDecoratorMetadata": true
*/
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    models: [__dirname + "/models/**/*.ts"],
});
exports.default = sequelize;
