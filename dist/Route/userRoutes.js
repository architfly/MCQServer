"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_Controller_1 = require("../Controller/User_Controller/User_Controller");
const Auth_1 = require("../Middleware/Auth");
const router = (0, express_1.Router)();
router.post("/signin", User_Controller_1.HandleSignup);
router.post("/login", User_Controller_1.HandleLogin);
router.put("/:userId", Auth_1.isAuth, User_Controller_1.HandleEditUser);
router.get("/getAll", Auth_1.isAuth, User_Controller_1.HandleGetUser);
router.delete("/:userId", Auth_1.isAuth, User_Controller_1.HandleDeleteUser);
router.get("/total", Auth_1.isAuth, User_Controller_1.HandleGetTotalUsers);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map