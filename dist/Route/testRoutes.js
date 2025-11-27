"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = require("../Middleware/Auth");
const Test_Controller_1 = require("../Controller/Test_Controller/Test_Controller");
const Multer_1 = __importDefault(require("../Middleware/Multer"));
const router = (0, express_1.Router)();
router.post("/create", Auth_1.isAuth, Test_Controller_1.HandleCreateTest);
router.get("/getAll", Test_Controller_1.HandleGetAllTests);
//user ki specific test get karne keliye hai api
router.get("/get/:testId", Test_Controller_1.HandleGetTestById);
router.post("/addQuestion/:testId", Multer_1.default.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "optionAImage", maxCount: 1 },
    { name: "optionBImage", maxCount: 1 },
    { name: "optionCImage", maxCount: 1 },
    { name: "optionDImage", maxCount: 1 },
]), Test_Controller_1.HandleAddQuestionToTest);
//edit question api hai ye ram ram
//router.post("/editQuestion/:testId/:questionId",HandleQuestionUpdateTest)
router.post("/editQuestion/:testId/:questionId", Multer_1.default.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "optionAImage", maxCount: 1 },
    { name: "optionBImage", maxCount: 1 },
    { name: "optionCImage", maxCount: 1 },
    { name: "optionDImage", maxCount: 1 },
]), Test_Controller_1.HandleQuestionUpdateTest);
///////////delete qauesiton ki api hai ye
router.delete("/deleteQuestion/:testId/:questionId", Test_Controller_1.HandleDeleteQuestionFromTest);
//user select karega option ye api retunr karega wrong or right anwser 
router.post("/userSelect/:testId", Auth_1.isAuth, Test_Controller_1.HandleSubmitTest);
//test delete api okay samjhe KETAN
router.delete("/delete/:testId", Auth_1.isAuth, Test_Controller_1.HandleDeleteTest);
//update test ka api hai ye samjhe ki nahi babu
router.post("/testUpdate/:testId", Auth_1.isAuth, Test_Controller_1.HandleTestUpdate);
router.post("/addBulkQuestion/:testId", Multer_1.default.any(), Test_Controller_1.HandleAddedManyQuestionToTest);
//unique user ka token se data niklaega kitna exam m marks aaya kaise hua
router.get("/getTest/:testId/:userId", Auth_1.isAuth, Test_Controller_1.GetUserTestData);
exports.default = router;
//# sourceMappingURL=testRoutes.js.map