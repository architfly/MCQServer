"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const courseRoutes_1 = __importDefault(require("./courseRoutes"));
const PromocodeRoute_1 = __importDefault(require("./PromocodeRoute"));
const testRoutes_1 = __importDefault(require("./testRoutes"));
const analyticsRoute_1 = __importDefault(require("./analyticsRoute"));
const PlanRoute_1 = __importDefault(require("./PlanRoute"));
const router = (0, express_1.Router)();
router.use("/user", userRoutes_1.default);
router.use("/course", courseRoutes_1.default);
router.use("/promocode", PromocodeRoute_1.default);
// router.use("/question", questionRoutes);
// router.use("/exam", examRoutes)
router.use("/test", testRoutes_1.default);
router.use("/analytics", analyticsRoute_1.default);
router.use("/plan", PlanRoute_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map