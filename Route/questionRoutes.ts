import { Router } from "express";
import { isAuth } from "../Middleware/Auth";
import {
  HandleAddQuestion,
  HandleGetAllQuestions,
  HandleEditQuestion,
  HandleDeleteQuestion,
} from "../Controller/Question_Controller/Question_Controller";

const router = Router();

router.post("/add", isAuth, HandleAddQuestion);
router.get("/getAll", isAuth, HandleGetAllQuestions);
router.put("/:questionId", isAuth, HandleEditQuestion);
router.delete("/:questionId", isAuth, HandleDeleteQuestion);

export default router;
