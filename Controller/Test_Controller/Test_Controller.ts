import { RequestHandler } from "express";
import Test from "../../Modal/Test";
import redisClient from "../../Config/RedisConnet";
import mongoose from "mongoose";
import { uploadToCloudinaryBuffer } from "../../Config/CloudConnect";
import xlsx from "xlsx";
//import PDFParse from "pdf-parse";


import mammoth from "mammoth";
import { text } from "body-parser";
export const HandleCreateTest: RequestHandler = async (req, res) => {
  try {
    // Only admin can create test
    if (req.user?.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "only admin can access it",
      });
    }

    const { courseId, testName, duration, questionNumber, questions } = req.body;

    // Validate required fields
    if (!courseId || !testName || !duration || !questionNumber || !questions) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    // ✅ Process questions with image uploads
    const processedQuestions = await Promise.all(
      questions.map(async (question: any, index: number) => {
        // ✅ Upload question image if exists
        let questionImageUrl = "";
        if (req.files && (req.files as any)[`questions[${index}][questionImage]`]) {
          const upload = await uploadToCloudinaryBuffer(
            (req.files as any)[`questions[${index}][questionImage]`][0].buffer,
            "test_questions"
          );
          questionImageUrl = upload.url;
        }

        // ✅ Upload option images if they exist
        let optionAImageUrl = "";
        let optionBImageUrl = "";
        let optionCImageUrl = "";
        let optionDImageUrl = "";

        if (req.files && (req.files as any)[`questions[${index}][optionAImage]`]) {
          const upload = await uploadToCloudinaryBuffer(
            (req.files as any)[`questions[${index}][optionAImage]`][0].buffer,
            "test_options"
          );
          optionAImageUrl = upload.url;
        }
        if (req.files && (req.files as any)[`questions[${index}][optionBImage]`]) {
          const upload = await uploadToCloudinaryBuffer(
            (req.files as any)[`questions[${index}][optionBImage]`][0].buffer,
            "test_options"
          );
          optionBImageUrl = upload.url;
        }
        if (req.files && (req.files as any)[`questions[${index}][optionCImage]`]) {
          const upload = await uploadToCloudinaryBuffer(
            (req.files as any)[`questions[${index}][optionCImage]`][0].buffer,
            "test_options"
          );
          optionCImageUrl = upload.url;
        }
        if (req.files && (req.files as any)[`questions[${index}][optionDImage]`]) {
          const upload = await uploadToCloudinaryBuffer(
            (req.files as any)[`questions[${index}][optionDImage]`][0].buffer,
            "test_options"
          );
          optionDImageUrl = upload.url;
        }

        // ✅ Build question object with proper text/image handling
        return {
          questionName: {
            text: typeof question.questionName === 'string' 
              ? question.questionName 
              : (question.questionName?.text || ""),
            image: questionImageUrl || 
                  (typeof question.questionName === 'object' ? question.questionName?.image : "") || "",
          },
          options: {
            A: {
              text: typeof question.options?.A === 'string' 
                ? question.options.A 
                : (question.options?.A?.text || ""),
              image: optionAImageUrl || 
                    (typeof question.options?.A === 'object' ? question.options.A?.image : "") || "",
            },
            B: {
              text: typeof question.options?.B === 'string' 
                ? question.options.B 
                : (question.options?.B?.text || ""),
              image: optionBImageUrl || 
                    (typeof question.options?.B === 'object' ? question.options.B?.image : "") || "",
            },
            C: {
              text: typeof question.options?.C === 'string' 
                ? question.options.C 
                : (question.options?.C?.text || ""),
              image: optionCImageUrl || 
                    (typeof question.options?.C === 'object' ? question.options.C?.image : "") || "",
            },
            D: {
              text: typeof question.options?.D === 'string' 
                ? question.options.D 
                : (question.options?.D?.text || ""),
              image: optionDImageUrl || 
                    (typeof question.options?.D === 'object' ? question.options.D?.image : "") || "",
            },
          },
          correctAnswer: question.correctAnswer,
        };
      })
    );

    // Create the test with processed questions
    const testCreate = await Test.create({
      courseId,
      testName,
      duration,
      questionNumber,
      questions: processedQuestions,
    });

    await redisClient.del("all_tests");

    // Save test to Redis for fast access
    const redisKey = `test:${testCreate._id}`;
    await redisClient.set(redisKey, JSON.stringify(testCreate), { EX: 60 * 60 });

    return res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: testCreate,
    });
  } catch (error) {
    console.log("error in HandleCreateTest", error);
    return res.status(500).json({
      success: false,
      message: "error in HandleCreateTest",
    });
  }
};

export const HandleGetAllTests: RequestHandler = async (req, res) => {
  try {
    const redisKey = `all_tests`;

    // Try to get from Redis first
    const cachedTests = await redisClient.get(redisKey);
    if (cachedTests) {
      return res.status(200).json({
        success: true,
        message: "All tests fetched from cache",
        data: JSON.parse(cachedTests),
      });
    }

    // Fallback to MongoDB if cache miss
    const tests = await Test.find().sort({ createdAt: -1 }); // latest first
    if (!tests || tests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tests found",
      });
    }

    // Cache the result in Redis for next time
    await redisClient.set(redisKey, JSON.stringify(tests), { EX: 60 * 60 }); // expires in 1 hour

    return res.status(200).json({
      success: true,
      message: "All tests fetched from database",
      data: tests,
    });
  } catch (error) {
    console.log("error in HandleGetAllTests", error);
    return res.status(500).json({
      success: false,
      message: "error in HandleGetAllTests",
    });
  }
};




export const HandleAddQuestionToTest: RequestHandler = async (req, res) => {
  try {
    const { testId } = req.params;
    let { questions } = req.body;
    const files = req.files as any;

    // 🧠 Parse if FormData sent as JSON string
    if (typeof questions === "string") {
      try {
        questions = JSON.parse(questions);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON in questions field",
        });
      }
    }

    // 🧾 Ensure array format
    if (!Array.isArray(questions)) {
      // single question fallback
      const { questionName, optionA, optionB, optionC, optionD, correctAnswer } = req.body;
      if (!questionName || !correctAnswer) {
        return res.status(400).json({ success: false, message: "No valid question data provided" });
      }
      questions = [{ questionName, optionA, optionB, optionC, optionD, correctAnswer }];
    }

    // 🧠 Fetch test
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });

    const addedQuestions: any[] = [];

    // 🌀 Process each question
    for (let i = 0; i < questions.length; i++) {
      const { questionName, optionA, optionB, optionC, optionD, correctAnswer } = questions[i];

      if (!questionName || !correctAnswer) continue;

      // 🖼️ Upload images if exists
      const uploadIfExists = async (field: string) => {
        if (files && files[field]) {
          const upload = await uploadToCloudinaryBuffer(files[field][0].buffer, "test_uploads");
          return upload.url;
        }
        return "";
      };

      const questionImageUrl = await uploadIfExists(`questionImage${i}`) || await uploadIfExists("questionImage");
      const optionAImageUrl = await uploadIfExists(`optionAImage${i}`) || await uploadIfExists("optionAImage");
      const optionBImageUrl = await uploadIfExists(`optionBImage${i}`) || await uploadIfExists("optionBImage");
      const optionCImageUrl = await uploadIfExists(`optionCImage${i}`) || await uploadIfExists("optionCImage");
      const optionDImageUrl = await uploadIfExists(`optionDImage${i}`) || await uploadIfExists("optionDImage");

      const newQuestion = {
        questionName: { text: questionName || "", image: questionImageUrl },
        options: {
          A: { text: optionA || "", image: optionAImageUrl },
          B: { text: optionB || "", image: optionBImageUrl },
          C: { text: optionC || "", image: optionCImageUrl },
          D: { text: optionD || "", image: optionDImageUrl },
        },
        correctAnswer,
      };

      test.questions.push(newQuestion);
      addedQuestions.push(newQuestion);
    }

    // 💾 Save updated test
    await test.save();

    // 🧹 Update Redis cache
    await redisClient.del("all_tests");
    await redisClient.set(`test:${testId}`, JSON.stringify(test), { EX: 60 * 60 });

    return res.status(200).json({
      success: true,
      message: `${addedQuestions.length} question(s) added successfully`,
      data: addedQuestions,
    });
  } catch (error) {
    console.error("Error in HandleAddQuestionToTest:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while adding questions",
    });
  }
};



export const HandleSubmitTest: RequestHandler = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers, userId: bodyUserId } = req.body;

    // Use logged-in user or request body
    const userId = req?.user?.id || bodyUserId;

    // Validate input
    if (!testId || !userId || !answers) {
      return res.status(400).json({
        success: false,
        message: "testId, userId, and answers are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testId format",
      });
    }

    await redisClient.del(`all_tests`);
    const redisKey = `test:${testId}`;
    let test: any;

    // Fetch Mongoose document (needed for save)
    test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    // Map answers for quick lookup
    const answerMap = new Map(
  answers.map((a: any) => [a.questionId, a.selectedOption || a.selectedAnswer || null])
);


    // Prepare result including Not Attempted for unanswered questions
    const result = test.questions.map((q: any) => {
      const selected = answerMap.get(q._id.toString());
      const status = selected
        ? selected === q.correctAnswer
          ? "Correct"
          : "Incorrect"
        : "Not Attempted";

      return {
        questionId: q._id,
        questionName: q.questionName,
        selectedOption: selected || null,
        correctAnswer: q.correctAnswer,
        result: status,
      };
    });

    // Check if the user already exists in the users array
    const existingIndex = test.users.findIndex(
      (u: any) => u.userId.toString() === userId
    );

    if (existingIndex !== -1) {
      // Update existing user's submission
      test.users[existingIndex].answers = result;
      test.users[existingIndex].submittedAt = new Date();
    } else {
      // Push new submission for new user
      test.users.push({
        userId,
        answers: result,
        submittedAt: new Date(),
      });
    }

    // Save changes in MongoDB
    await test.save();

    // Update Redis cache
    await redisClient.set(redisKey, JSON.stringify(test), { EX: 60 * 60 });

    return res.status(200).json({
      success: true,
      message: "Test submitted successfully",
      total: test.questions.length,
      data: result,
    });
  } catch (error) {
    console.log("Error in HandleSubmitTest", error);
    return res.status(500).json({
      success: false,
      message: "Error in HandleSubmitTest",
    });
  }
};


export const HandleGetTestById: RequestHandler = async (req, res) => {
  try {
    const { testId } = req.params;

    // Validate testId
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid testId format",
      });
    }

    
    const redisKey = `test:${testId}`;
    let test: any;

    // Check Redis cache
    const cachedTest = await redisClient.get(redisKey);
    if (cachedTest) {
      test = JSON.parse(cachedTest);
      return res.status(200).json({
        success: true,
        message: "Test fetched from cache",
        data: test,
      });
    }

    // Fetch from MongoDB if cache miss
    test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    // Cache in Redis for future requests
    await redisClient.set(redisKey, JSON.stringify(test), { EX: 60 * 60 });

    return res.status(200).json({
      success: true,
      message: "Test fetched from database",
      data: test,
    });
  } catch (error) {
    console.log("Error in HandleGetTestById", error);
    return res.status(500).json({
      success: false,
      message: "Error in HandleGetTestById",
    });
  }
};




export const HandleDeleteQuestionFromTest: RequestHandler = async (req, res) => {
   try{ 
    const {testId, questionId}= req.params;
    if(!mongoose.Types.ObjectId.isValid(testId) || !mongoose.Types.ObjectId.isValid(questionId)){
      return res.status(400).json({
        success:false,
        message:"Invalid testId or questionId format",
      });
    }

    const test= await Test.findById(testId);
    if(!test){
      return res.status(404).json({
        success:false,
        message:"Test not found",
      });
    }

    const questioIndex=test.questions.findIndex((q:any)=>q._id.toString()===questionId);
    if(questioIndex===-1){
      return res.status(404).json({
        success:false,
        message:"Question not found in test",
      });
    }

    test.questions.splice(questioIndex,1);
    await test.save();

    await redisClient.del(`all_tests`);
    const redisKey= `test:${testId}`;
    await redisClient.set(redisKey,JSON.stringify(test),{EX:60 * 60});

    return res.status(200).json({
      success:true,
      message:"Question deleted from test successfully",
      data:test,
    }

  )

   }catch(error){
    console.log("Error in HandleDeleteQuestionFromTest", error);
    return res.status(500).json({
      success: false,
      message: "Error in HandleDeleteQuestionFromTest",
    });
   }
}




export const HandleQuestionUpdateTest: RequestHandler = async (req, res) => {
  try {
    const { testId, questionId } = req.params;
    const {
      questionName,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
    } = req.body;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const questionIndex = test.questions.findIndex(
      (q: any) => q._id.toString() === questionId
    );
    if (questionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const question = test.questions[questionIndex];

    // ✅ Upload images if provided
    let questionImageUrl = question.questionName?.image || "";
    let optionAImageUrl = question.options?.A?.image || "";
    let optionBImageUrl = question.options?.B?.image || "";
    let optionCImageUrl = question.options?.C?.image || "";
    let optionDImageUrl = question.options?.D?.image || "";

    if (req.files && (req.files as any).questionImage) {
      const upload = await uploadToCloudinaryBuffer(
        (req.files as any).questionImage[0].buffer,
        "test_questions"
      );
      questionImageUrl = upload.url;
    }

    if (req.files && (req.files as any).optionAImage) {
      const upload = await uploadToCloudinaryBuffer(
        (req.files as any).optionAImage[0].buffer,
        "test_options"
      );
      optionAImageUrl = upload.url;
    }

    if (req.files && (req.files as any).optionBImage) {
      const upload = await uploadToCloudinaryBuffer(
        (req.files as any).optionBImage[0].buffer,
        "test_options"
      );
      optionBImageUrl = upload.url;
    }

    if (req.files && (req.files as any).optionCImage) {
      const upload = await uploadToCloudinaryBuffer(
        (req.files as any).optionCImage[0].buffer,
        "test_options"
      );
      optionCImageUrl = upload.url;
    }

    if (req.files && (req.files as any).optionDImage) {
      const upload = await uploadToCloudinaryBuffer(
        (req.files as any).optionDImage[0].buffer,
        "test_options"
      );
      optionDImageUrl = upload.url;
    }

    // ✅ Update question fields (text + image both)
    question.questionName = {
      text: questionName || question.questionName?.text || "",
      image: questionImageUrl,
    };

    question.options = {
      A: {
        text: optionA || question.options?.A?.text || "",
        image: optionAImageUrl,
      },
      B: {
        text: optionB || question.options?.B?.text || "",
        image: optionBImageUrl,
      },
      C: {
        text: optionC || question.options?.C?.text || "",
        image: optionCImageUrl,
      },
      D: {
        text: optionD || question.options?.D?.text || "",
        image: optionDImageUrl,
      },
    };

    question.correctAnswer = correctAnswer || question.correctAnswer;

    test.questions[questionIndex] = question;
    await test.save();

    await redisClient.del(`all_tests`);
    const redisKey = `test:${testId}`;
    await redisClient.set(redisKey, JSON.stringify(test), { EX: 60 * 60 });

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: test.questions[questionIndex],
    });
  } catch (error) {
    console.error("Error in HandleQuestionUpdateTest", error);
    return res.status(500).json({
      success: false,
      message: "Error in HandleQuestionUpdateTest",
      
    });
  }
};




export const HandleTestUpdate: RequestHandler = async (req, res) => {
  try {
    const { testId } = req.params;
    const { testName, duration } = req.body; // ✅ query se nahi, body se lena better hai

    // ✅ Validate taskId
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid taskId format",
      });
    }

    if(!testName || !duration){
      return res.status(400).json({
        success:false,
        message:"All fields are required",
      })
    }

    // ✅ Prepare update object dynamically
    const updateFields: any = {};
    if (testName) updateFields.testName = testName;
    if (duration) updateFields.duration = duration;

    // ✅ Update only provided fields
    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }


    await redisClient.del("all_tests");
    const redisKey=`test:${testId}`;
    await redisClient.set(redisKey,JSON.stringify(updatedTest),{EX:60 * 60 });

    return res.status(200).json({
      success: true,
      message: "Test updated successfully",
      data: updatedTest,
    });
  } catch (error) {
    console.log("Error in HandleTestUpdate", error);
    return res.status(500).json({
      success: false,
      message: "Error in HandleTestUpdate",
    });
  }
};


export const HandleDeleteTest:RequestHandler=async(req,res)=>{
  try{
    const {testId}= req.params;
    if(!mongoose.Types.ObjectId.isValid(testId)){
      return res.status(400).json({
        success:false,
        message:"Invalid testId format",
      });
    }

    const testDelete= await Test.findByIdAndDelete(testId);

    if(!testDelete){
      return res.status(404).json({
        success:false,
        message:"Test not found",
      });
    }

    await redisClient.del("all_tests");
    const redisKey=`test:${testId}`;
    await redisClient.del(redisKey);

    return res.status(200).json({
      success:true,
      message:"Test deleted Successfully",
      data:testDelete
    })


  }
  catch(error){
    console.log("Error in HandleDeleteTest", error);
    return res.status(500).json({
      success: false,
      message: "Error in HandleDeleteTest",
    });
  }
}


// Remove the import statement and use require instead
const pdfParse = require("pdf-parse");

interface QuestionInput {
  questionName: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
}




export const HandleAddedManyQuestionToTest: RequestHandler = async (req, res) => {
  try {
    const { testId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const cleanTestId = testId.replace(/"/g, "");
    if (!mongoose.Types.ObjectId.isValid(cleanTestId)) {
      return res.status(400).json({ success: false, message: "Invalid testId" });
    }

    const test = await Test.findById(cleanTestId);
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });

    const allQuestions: any[] = [];

    for (const file of files) {
      const extension = file.originalname.split(".").pop()?.toLowerCase();

      let lines: string[] = [];

      if (extension === "xlsx" || extension === "xls") {
        const workbook = xlsx.read(file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        rows.forEach(row => {
          if (row.question && row.answer) {
            allQuestions.push({
              questionName: row.question,
              optionA: row.A || "",
              optionB: row.B || "",
              optionC: row.C || "",
              optionD: row.D || "",
              correctAnswer: row.answer,
            });
          }
        });
      } else if (extension === "pdf") {
        const pdfParse = require("pdf-parse");
        const data = await pdfParse(file.buffer);
        lines = data.text.split("\n").map((l: string) => l.trim()).filter((l: string) => l);

      } else if (extension === "docx") {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        lines = result.value.split("\n").map(l => l.trim()).filter(l => l);
      } else {
        return res.status(400).json({ success: false, message: "Unsupported file type" });
      }

      // ✅ Parse questions from lines
      let currentQ: any = { questionName: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" };
      for (let line of lines) {
        if (/^A:/i.test(line)) currentQ.optionA = line.replace(/^A:\s*/i, "");
        else if (/^B:/i.test(line)) currentQ.optionB = line.replace(/^B:\s*/i, "");
        else if (/^C:/i.test(line)) currentQ.optionC = line.replace(/^C:\s*/i, "");
        else if (/^D:/i.test(line)) currentQ.optionD = line.replace(/^D:\s*/i, "");
        else if (/^Answer:/i.test(line)) {
          currentQ.correctAnswer = line.replace(/^Answer:\s*/i, "").toUpperCase();
          if (currentQ.questionName && currentQ.correctAnswer) {
            allQuestions.push({ ...currentQ });
          }
          currentQ = { questionName: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" };
        } else {
          // Append to question text (handles long questions)
          currentQ.questionName += (currentQ.questionName ? " " : "") + line;
        }
      }
    }

    if (allQuestions.length === 0) {
      return res.status(400).json({ success: false, message: "No valid questions found" });
    }

    const addedQuestions = allQuestions.map(q => ({
      questionName: { text: q.questionName, image: "" },
      options: {
        A: { text: q.optionA, image: "" },
        B: { text: q.optionB, image: "" },
        C: { text: q.optionC, image: "" },
        D: { text: q.optionD, image: "" },
      },
      correctAnswer: q.correctAnswer,
    }));

    test.questions.push(...addedQuestions);
    await test.save();

    await redisClient.del("all_tests");
    await redisClient.set(`test:${testId}`, JSON.stringify(test), { EX: 60 * 60 });

    return res.status(200).json({
      success: true,
      message: `${addedQuestions.length} question(s) added successfully`,
      data: addedQuestions,
    });
  } catch (error) {
    console.error("Error in HandleAddedManyQuestionToTest:", error);
    return res.status(500).json({ success: false, message: "Error while adding bulk questions" });
  }
};

export const GetUserTestData: RequestHandler = async (req, res) => {
  try {
    const { testId, userId: bodyUserId } = req.params;
    const userId = req?.user?.id || bodyUserId;

    // Validate required fields
    if (!testId || !userId) {
      return res.status(400).json({
        success: false,
        message: "testId and userId are required",
      });
    }

    // Validate testId format
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(403).json({
        success: false,
        message: "Invalid testId format",
      });
    }

    const redisKey = `test:${testId}`;
    let test: any;

    // Try cache first
    const cachedTest = await redisClient.get(redisKey);
    if (cachedTest) {
      test = JSON.parse(cachedTest);
    } else {
      test = await Test.findById(testId);
      if (!test) {
        return res.status(404).json({
          success: false,
          message: "Test not found",
        });
      }

      // Store in cache for 1 hour
      await redisClient.set(redisKey, JSON.stringify(test), { EX: 60 * 60 });
    }

    // Find this user's submission
    const userSubmission = test.users.find(
      (u: any) => u.userId.toString() === userId
    );

    if (!userSubmission) {
      return res.status(404).json({
        success: false,
        message: "User has not submitted this test",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "User test data fetched successfully",
      data: {
        userId,
        submittedAt: userSubmission.submittedAt,
        answers: userSubmission.answers,
      },
    });
  } catch (error) {
    console.error("Error in GetUserTestData:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user test data",
    });
  }
};
