"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleGetAllPurchase = exports.HandleGetPurchase = exports.HandlePurchaseCreate = void 0;
const Purchase_1 = __importDefault(require("../../Modal/Purchase"));
// import Razorpay from "razorpay"; // 🔒 Uncomment in future for Razorpay integration
// 🔒 Future: Razorpay setup
/*
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
*/
const HandlePurchaseCreate = async (req, res) => {
    try {
        const { userId, planId, promoCodeId, originalPrice, discountedPrice, discountPercent, startDate, expiryDate, isActive, allCoursesUnlocked, } = req.body;
        // 🧩 Basic validation
        if (!userId ||
            !planId ||
            !originalPrice ||
            !discountedPrice ||
            !discountPercent ||
            !startDate ||
            !expiryDate) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }
        // 💳 Step 1: Create Razorpay order (Future use)
        /*
        const order = await razorpay.orders.create({
          amount: Math.round(discountedPrice * 100), // amount in paisa
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        });
        */
        // 💾 Step 2: Save to DB (currently creates purchase directly)
        const newPurchase = new Purchase_1.default({
            userId,
            planId,
            promoCodeId,
            originalPrice,
            discountedPrice,
            discountPercent,
            startDate,
            expiryDate,
            isActive: isActive ?? true, // default true for now
            allCoursesUnlocked: allCoursesUnlocked ?? true,
            // razorpayOrderId: order?.id, // 🔒 Future use
        });
        await newPurchase.save();
        // 🎯 Step 3: Return success (no Razorpay order yet)
        return res.status(201).json({
            success: true,
            message: "Purchase created successfully (Razorpay integration pending)",
            data: newPurchase,
        });
    }
    catch (error) {
        console.error("Handle Purchase Create error:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating purchase",
        });
    }
};
exports.HandlePurchaseCreate = HandlePurchaseCreate;
const HandleGetPurchase = async (req, res) => {
    try {
        const userId = req?.user?.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found",
            });
        }
        const Purchases = await Purchase_1.default.find({ userId }).populate("planId").populate("promoCodeId").sort({ createdAt: -1 });
        if (!Purchases || Purchases.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No Purchase History"
            });
        }
        return res.status(200).json({
            success: false,
            message: "User Purchase hisroy fecthed succefuuly",
            data: Purchases
        });
    }
    catch (error) {
        console.log("Handle Get Purchase", error);
        return res.status(500).json({
            success: false,
            message: "this is Handlke get purchse"
        });
    }
};
exports.HandleGetPurchase = HandleGetPurchase;
const HandleGetAllPurchase = async (req, res) => {
    try {
        const purchaseOkay = await Purchase_1.default.find().populate("userId", "name email").populate("planId").populate("promoCodeId").sort({ createdAt: -1 });
        if (!purchaseOkay.length) {
            return res.status(404).json({
                success: false,
                message: "No Purchase found"
            });
        }
        return res.status(200).json({
            success: false,
            message: "All purchase was Succedssulyy",
            data: purchaseOkay
        });
    }
    catch (error) {
        console.log("HAndle Get Purchase", error);
        return res.status(500).json({
            success: false,
            message: "Handle Get All Purchase"
        });
    }
};
exports.HandleGetAllPurchase = HandleGetAllPurchase;
// import crypto from "crypto";
// export const HandleVerifyPayment: RequestHandler = async (req, res) => {
//   try {
//     const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
//     const body = razorpayOrderId + "|" + razorpayPaymentId;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
//       .update(body.toString())
//       .digest("hex");
//     if (expectedSignature !== razorpaySignature) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment verification failed",
//       });
//     }
//     // ✅ Update purchase as active
//     await Purchase.findOneAndUpdate(
//       { razorpayOrderId },
//       { isActive: true, allCoursesUnlocked: true }
//     );
//     return res.status(200).json({
//       success: true,
//       message: "Payment verified successfully",
//     });
//   } catch (error) {
//     console.error("HandleVerifyPayment error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error verifying payment",
//     });
//   }
// };
//# sourceMappingURL=Purchase_Controller.js.map