"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Analytics_Controller_1 = require("../Controller/Analytics_Controller/Analytics_Controller");
const router = (0, express_1.Router)();
router.get("/totalUser", Analytics_Controller_1.TotalUserCount);
router.get("/totalTest", Analytics_Controller_1.TotalTestAttempt);
exports.default = router;
//# sourceMappingURL=analyticsRoute.js.map