import { Router, Request, Response } from "express";
import userRoutes from "./userRoutes";
import courseRoutes from "./courseRoutes";

import promoRoutes from "./PromocodeRoute"
import testRoutes from "./testRoutes";
import analyticsRoute from "./analyticsRoute";
import planRoute from "./PlanRoute"


const router = Router();

router.use("/user", userRoutes);

router.use("/course", courseRoutes);

router.use("/promocode",promoRoutes);

// router.use("/question", questionRoutes);
 
// router.use("/exam", examRoutes)

router.use("/test",testRoutes);

router.use("/analytics",analyticsRoute);

router.use("/plan",planRoute)

export default router;
 