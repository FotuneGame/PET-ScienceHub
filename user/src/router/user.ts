import express, {Router} from "express";
import {controller} from "../controller/";
import {ware} from "../middleware/";



const userRouter:Router = express.Router();


userRouter.get("/:id", controller.UserController.get);
userRouter.post("/refresh",ware.tokensWare, controller.UserController.refresh);

userRouter.post("/confirm", ware.checkCodeWare, controller.UserController.confirm);
userRouter.post("/code", ware.generationCodeWare, controller.UserController.message);

userRouter.post("/login",ware.confirmWare, ware.findUserWare, ware.findMetaUserWare, ware.findSettingWare, controller.UserController.login);
userRouter.post("/registration", ware.confirmWare, ware.findUserWare, controller.UserController.registration);

userRouter.delete("/delete",ware.tokensWare, ware.confirmWare, ware.findUserWare, ware.findMetaUserWare, ware.findSettingWare, controller.UserController.delete);
userRouter.patch("/new/password", ware.tokensWare, ware.confirmWare, ware.findUserWare, ware.findMetaUserWare, ware.findSettingWare, controller.UserController.setPassword);
userRouter.patch("/new/phone", ware.tokensWare, ware.confirmWare, ware.findUserWare, ware.findMetaUserWare, ware.findSettingWare, controller.UserController.setPhone);
userRouter.patch("/new/email", ware.tokensWare, ware.confirmWare, ware.findUserWare, ware.findMetaUserWare, ware.findSettingWare, controller.UserController.setEmail);


export default userRouter;
