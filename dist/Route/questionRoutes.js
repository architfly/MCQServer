"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = require("../Middleware/Auth");
const Question_Controller_1 = require("../Controller/Question_Controller/Question_Controller");
const router = (0, express_1.Router)();
router.post("/add", Auth_1.isAuth, Question_Controller_1.HandleAddQuestion);
router.get("/getAll", Auth_1.isAuth, Question_Controller_1.HandleGetAllQuestions);
router.put("/:questionId", Auth_1.isAuth, Question_Controller_1.HandleEditQuestion);
router.delete("/:questionId", Auth_1.isAuth, Question_Controller_1.HandleDeleteQuestion);
exports.default = router;
//# sourceMappingURL=questionRoutes.js.map