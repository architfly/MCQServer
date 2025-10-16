import { Router } from "express";
import { isAuth } from "../Middleware/Auth";
import {
  HandleCourseAdd,
  HandleCourseDelete,
  HandleCourseEdit,
  HandleCourseGetAll,
} from "../Controller/Course_Controller/Course_Controller";

const router = Router();

router.post("/course", isAuth, HandleCourseAdd);
router.get("/getAll", HandleCourseGetAll);
router.put("/:courseId", isAuth, HandleCourseEdit);
router.delete("/:courseId", isAuth, HandleCourseDelete);

export default router;
