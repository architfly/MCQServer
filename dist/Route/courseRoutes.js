"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = require("../Middleware/Auth");
const Course_Controller_1 = require("../Controller/Course_Controller/Course_Controller");
const router = (0, express_1.Router)();
router.post("/course", Auth_1.isAuth, Course_Controller_1.HandleCourseAdd);
router.get("/getAll", Course_Controller_1.HandleCourseGetAll);
router.put("/:courseId", Auth_1.isAuth, Course_Controller_1.HandleCourseEdit);
router.delete("/:courseId", Auth_1.isAuth, Course_Controller_1.HandleCourseDelete);
exports.default = router;
//# sourceMappingURL=courseRoutes.js.map