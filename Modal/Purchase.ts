import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPurchase extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  planId: mongoose.Schema.Types.ObjectId;
  promoCodeId?: mongoose.Schema.Types.ObjectId;
  originalPrice: number;
  discountedPrice: number;
  discountPercent?: number;
  startDate: Date;
  expiryDate: Date;
  isActive: boolean;
  allCoursesUnlocked: boolean;
}

const purchaseSchema: Schema<IPurchase> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ✅ corrected spelling
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    promoCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PromoCode", // ✅ corrected capitalization
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    discountPercent: {
      type: Number,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    allCoursesUnlocked: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Purchase: Model<IPurchase> = mongoose.model<IPurchase>(
  "Purchase",
  purchaseSchema
);

export default Purchase;
