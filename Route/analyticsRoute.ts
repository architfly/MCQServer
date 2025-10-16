import { Router } from "express";
import { isAuth } from "../Middleware/Auth";
import {
  TotalTestAttempt,
  TotalUserCount,
} from "../Controller/Analytics_Controller/Analytics_Controller";

const router = Router();


router.get("/totalUser", TotalUserCount);


router.get("/totalTest", TotalTestAttempt);

export default router;
