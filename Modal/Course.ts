import mongoose, { Document, Schema, Model } from "mongoose";
import { isUser } from "./User";

export interface isCourse extends Document {
  courseName: string;
  courseCode: string;
  description: string;
  
}

const courseSchema: Schema<isCourse> = new Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
     
  },
  { timestamps: true }
);

const Course: Model<isCourse> = mongoose.model<isCourse>(
  "Course",
  courseSchema
);
export default Course;
