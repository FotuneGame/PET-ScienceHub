import express, {Router} from "express";
import {controller} from "../controller/";
import {ware} from "../middleware/";
import passport from "../passport";



const userRouter:Router = express.Router();


userRouter.get("/google", passport.authenticate("google", {scope:["profile"]}));
userRouter.get("/google/redirect", passport.authenticate("google", {
    successRedirect: "/google/auth",
    failureRedirect: "/google/fail"
}))
userRouter.get("/google/auth", controller.GoogleController.sign);
userRouter.get("/google/fail", controller.GoogleController.fail);

userRouter.get("/github", passport.authenticate("github", {scope:["profile"]}));
userRouter.get("/github/redirect", passport.authenticate("github", {
    successRedirect: "/github/auth",
    failureRedirect: "/github/fail"
}))
userRouter.get("/github/auth", controller.GitHubController.sign);
userRouter.get("/github/fail", controller.GitHubController.fail);




userRouter.get("/data/:id", controller.UserController.get);
userRouter.post("/refresh",ware.tokensWare, controller.UserController.refresh);

userRouter.post("/confirm", ware.checkCodeWare, controller.UserController.confirm);
userRouter.post("/code", ware.generationCodeWare, controller.UserController.message);

userRouter.post("/login",ware.confirmWare, ware.findUserWare, ware.findMetaUserWare, ware.findSettingWare, controller.UserController.login);
userRouter.post("/registration", ware.confirmWare, ware.findUserWare, controller.UserController.registration);

userRouter.delete("/delete",ware.tokensWare, ware.confirmWare, ware.findUserWare, ware.findMetaUserWare, ware.findSettingWare, controller.UserController.delete);
userRouter.patch("/new/password", ware.tokensWare, ware.confirmWare, ware.findUserWare, ware.findMetaUserWare, ware.findSettingWare, controller.UserController.setPassword);

userRouter.patch("/new/phone", ware.tokensWare, ware.confirmNewPhoneWare, ware.findUserWare, ware.findMetaUserWare, ware.findSettingWare, controller.UserController.setPhone);
userRouter.patch("/new/email", ware.tokensWare, ware.confirmNewEmailWare, ware.findUserWare, ware.findMetaUserWare, ware.findSettingWare, controller.UserController.setEmail);


export default userRouter;
