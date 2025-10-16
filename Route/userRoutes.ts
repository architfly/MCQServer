import { Router, Request, Response } from "express";
import {
  HandleDeleteUser,
  HandleEditUser,
  HandleGetUser,
  HandleLogin,
  HandleSignup,
  HandleGetTotalUsers,
} from "../Controller/User_Controller/User_Controller";
import { isAuth } from "../Middleware/Auth";

const router = Router();

router.post("/signin", HandleSignup);

router.post("/login", HandleLogin);

router.put("/:userId", isAuth, HandleEditUser);

router.get("/getAll", isAuth, HandleGetUser);

router.delete("/:userId", isAuth, HandleDeleteUser);

router.get("/total", isAuth, HandleGetTotalUsers);

export default router;
