import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPromoCode extends Document {
  code: string;
  discount: number; // percentage
  validTill: Date;
  isActive: boolean;
}

const promoSchema: Schema<IPromoCode> = new Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  validTill: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

const PromoCode: Model<IPromoCode> = mongoose.model<IPromoCode>("PromoCode", promoSchema);
export default PromoCode;
