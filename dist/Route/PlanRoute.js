"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Plan_Controller_1 = require("../Controller/Plan_Controller/Plan_Controller");
const router = (0, express_1.Router)();
router.post("/create", Plan_Controller_1.HandlePlanCreate);
router.delete("/plan/:planId", Plan_Controller_1.HandlePlanDelete);
router.put("/plan/:PlanId", Plan_Controller_1.HandlePlanEdit);
router.get("/get", Plan_Controller_1.HandlePlanGet);
exports.default = router;
//# sourceMappingURL=PlanRoute.js.map