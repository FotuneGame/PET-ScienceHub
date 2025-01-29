"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = __importDefault(require("./error"));
const router_1 = __importDefault(require("./router"));
const db_1 = __importDefault(require("./db"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const middleware_1 = require("./middleware/");
const PORT = process.env.PORT || 3001;
const ULR_CORS = process.env.URL_CORS || ["http://localhost:3000"];
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || origin && ULR_CORS.includes(origin))
            callback(null, true);
        else
            callback(error_1.default.badRequest("CORS", "Not allowed by CORS"));
    },
    allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/static", express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use((0, express_fileupload_1.default)({ createParentPath: true }));
app.use("/", router_1.default);
app.use(middleware_1.errorWare);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.authenticate();
    yield db_1.default.sync();
    console.log(`[user]: User is running at http://localhost:` + PORT);
}));
