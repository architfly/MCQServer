import { Router } from "express";
import { HandlePlanCreate, HandlePlanDelete, HandlePlanEdit, HandlePlanGet } from "../Controller/Plan_Controller/Plan_Controller";

const router=Router();

router.post("/create",HandlePlanCreate)

router.delete("/plan/:planId",HandlePlanDelete)

router.put("/plan/:PlanId",HandlePlanEdit)

router.get("/get",HandlePlanGet)


export default router;