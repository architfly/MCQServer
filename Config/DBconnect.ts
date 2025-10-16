import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_URL || "");
    console.log("connected Successfully enyjoy it Ketan mongoDb");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
