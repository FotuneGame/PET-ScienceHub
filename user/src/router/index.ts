import express, {Router} from "express";
import userRouter from "./user";
import settingRouter from "./setting";

const router:Router = express.Router();

router.use("/",userRouter);
router.use("/setting", settingRouter);



export default router;