"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/Route/examRoutes.ts
const express_1 = require("express");
const Auth_1 = require("../Middleware/Auth");
const Exam_Controller_1 = require("../Controller/Exam_Controller/Exam_Controller");
const router = (0, express_1.Router)();
router.post("/start", Auth_1.isAuth, Exam_Controller_1.HandleStartExam);
router.post("/submit/:attemptId", Auth_1.isAuth, Exam_Controller_1.HandleSubmitExam);
router.get("/history", Auth_1.isAuth, Exam_Controller_1.HandleGetExamHistory);
exports.default = router;
//# sourceMappingURL=examRoutes.js.map