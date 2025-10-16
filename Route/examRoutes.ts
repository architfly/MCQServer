// src/Route/examRoutes.ts
import { Router } from "express";
import { isAuth } from "../Middleware/Auth";
import { HandleStartExam, HandleSubmitExam, HandleGetExamHistory } from "../Controller/Exam_Controller/Exam_Controller";

const router = Router();

router.post("/start", isAuth, HandleStartExam);
router.post("/submit/:attemptId", isAuth, HandleSubmitExam);
router.get("/history", isAuth, HandleGetExamHistory);

export default router;
