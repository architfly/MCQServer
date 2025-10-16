    import { Router } from "express";

    import { isAuth } from "../Middleware/Auth";
    import { GetUserTestData, HandleAddedManyQuestionToTest, HandleAddQuestionToTest, HandleCreateTest, HandleDeleteQuestionFromTest, HandleDeleteTest, HandleGetAllTests, HandleGetTestById, HandleQuestionUpdateTest, HandleSubmitTest, HandleTestUpdate } from "../Controller/Test_Controller/Test_Controller";
import upload from "../Middleware/Multer";
    const router = Router();

    router.post("/create", isAuth, HandleCreateTest);


    


    router.get("/getAll", HandleGetAllTests);

    //user ki specific test get karne keliye hai api
    router.get("/get/:testId", HandleGetTestById);
    
    router.post(
  "/addQuestion/:testId",
  upload.fields([
    { name: "questionImage", maxCount: 1 },
    { name: "optionAImage", maxCount: 1 },
    { name: "optionBImage", maxCount: 1 },
    { name: "optionCImage", maxCount: 1 },
    { name: "optionDImage", maxCount: 1 },
  ]),
  HandleAddQuestionToTest
);

    
    //edit question api hai ye ram ram
    //router.post("/editQuestion/:testId/:questionId",HandleQuestionUpdateTest)
    router.post(
  "/editQuestion/:testId/:questionId",
  upload.fields([
    { name: "questionImage",maxCount: 1 },
    { name: "optionAImage", maxCount: 1 },
    { name: "optionBImage", maxCount: 1 },
    { name: "optionCImage", maxCount: 1 },
    { name: "optionDImage", maxCount: 1 },
  ]),
  
  HandleQuestionUpdateTest
);


    ///////////delete qauesiton ki api hai ye
    router.delete("/deleteQuestion/:testId/:questionId",HandleDeleteQuestionFromTest);

    //user select karega option ye api retunr karega wrong or right anwser 
    router.post("/userSelect/:testId",isAuth,HandleSubmitTest);

    //test delete api okay samjhe KETAN
    router.delete("/delete/:testId",isAuth,HandleDeleteTest);


    //update test ka api hai ye samjhe ki nahi babu
    router.post("/testUpdate/:testId",isAuth,HandleTestUpdate);


    router.post("/addBulkQuestion/:testId",upload.any(),HandleAddedManyQuestionToTest);

    //unique user ka token se data niklaega kitna exam m marks aaya kaise hua
    router.get("/getTest/:testId/:userId",isAuth,GetUserTestData)

    export default router;
