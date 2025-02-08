import express, {Router} from "express";
import {controller} from "../controller/";
import {ware} from "../middleware/";



const settingRouter:Router = express.Router();


settingRouter.post("/:id",ware.tokensWare, ware.findUserWare, ware.findSettingWare, controller.SettingController.get);
settingRouter.put("/update", ware.tokensWare, ware.findUserWare, ware.findSettingWare, controller.SettingController.update);


export default settingRouter;
