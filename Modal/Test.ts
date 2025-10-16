


import mongoose, { Schema, Document } from "mongoose";

export interface ITest extends Document {
  courseId: mongoose.Schema.Types.ObjectId;
  testName: string;
  duration: string;
  questionNumber: number;
  questions: {
    questionName?: { text?: string; image?: string }; // text + image
    options: {
      A?: { text?: string; image?: string };
      B?: { text?: string; image?: string };
      C?: { text?: string; image?: string };
      D?: { text?: string; image?: string };
    };
    correctAnswer: string;
  }[];
  users: {
    userId: mongoose.Schema.Types.ObjectId;
    status: "pending" | "completed";
    score?: number;
    answers?: {
      questionId: mongoose.Schema.Types.ObjectId;
      selectedOption: string;
    }[];
  }[];
}

const testSchema: Schema<ITest> = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    testName: { type: String, required: true },
    duration: { type: String, required: true },
    questionNumber: { type: Number },
    questions: [
      {
        questionName: {
          text: { type: String },
          image: { type: String },
        },
        options: {
          A: { text: { type: String }, image: { type: String } },
          B: { text: { type: String }, image: { type: String } },
          C: { text: { type: String }, image: { type: String } },
          D: { text: { type: String }, image: { type: String } },
        },
        correctAnswer: { type: String, required: true },
      },
    ],
    users: {
      type: [
        {
          userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
          status: { type: String, enum: ["pending", "completed"], default: "pending" },
          score: { type: Number },
          answers: [
            {
              questionId: { type: Schema.Types.ObjectId },
              selectedOption: { type: String },
            },
          ],
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Test = mongoose.model<ITest>("Test", testSchema);
export default Test;
