"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlePromoCodeDelete = exports.HandlePromoCodeEdit = exports.HandlePromocodeGet = exports.HandlePromocodeCreate = void 0;
const Promocode_1 = __importDefault(require("../../Modal/Promocode"));
const HandlePromocodeCreate = async (req, res) => {
    try {
        const { code, discount, validTill, isActive } = req.body; // ✅ Changed inActive to isActive
        if (!code || !discount || !validTill) {
            return res.status(400).json({
                success: false,
                message: "Code, discount, and validTill are required",
            });
        }
        const newPromoCode = await Promocode_1.default.create({
            code: code.toUpperCase(),
            discount,
            validTill: new Date(validTill),
            isActive: isActive !== undefined ? isActive : true, // ✅ Use isActive
        });
        return res.status(201).json({
            success: true,
            message: "Promocode created successfully",
            data: newPromoCode,
        });
    }
    catch (error) {
        console.log("HandlePromocodeCreate error:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Promo code already exists",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error creating promocode",
        });
    }
};
exports.HandlePromocodeCreate = HandlePromocodeCreate;
const HandlePromocodeGet = async (req, res) => {
    try {
        const allPromocode = await Promocode_1.default.find({});
        if (!allPromocode) {
            return res.status(400).json({
                success: false,
                message: "there is true in all data",
            });
        }
        return res.status(200).json({
            success: true,
            message: "successfully fetch it okay",
            data: allPromocode
        });
    }
    catch (error) {
        console.log("handlepromocedieGet", error);
        return res.status(400).json({
            success: false,
            message: "Handle create error",
        });
    }
};
exports.HandlePromocodeGet = HandlePromocodeGet;
const HandlePromoCodeEdit = async (req, res) => {
    try {
        const { promoId } = req.params;
        // Add null check for req.body
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing",
            });
        }
        const { code, discount, validTill, isActive } = req.body;
        // Add validation for required fields
        if (!code || !discount || !validTill || isActive === undefined) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: code, discount, validTill, isActive",
            });
        }
        const PromocodeApply = await Promocode_1.default.findByIdAndUpdate(promoId, { code, discount, validTill, isActive }, { new: true });
        if (!PromocodeApply) {
            return res.status(404).json({
                success: false,
                message: "Promocode not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Promocode updated successfully",
            data: PromocodeApply
        });
    }
    catch (error) {
        console.log("handle Error ine edit", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.HandlePromoCodeEdit = HandlePromoCodeEdit;
const HandlePromoCodeDelete = async (req, res) => {
    try {
        const { promoId } = req.params;
        if (!promoId) {
            return res.status(400).json({
                success: false,
                message: "promoId is required",
            });
        }
        const deletedPromo = await Promocode_1.default.findByIdAndDelete(promoId);
        if (!deletedPromo) {
            return res.status(404).json({
                success: false,
                message: "Promocode not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Promocode deleted successfully",
            data: deletedPromo,
        });
    }
    catch (error) {
        console.error("HandlePromoCodeDelete error:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting promocode",
        });
    }
};
exports.HandlePromoCodeDelete = HandlePromoCodeDelete;
// // Promocode_Controller.ts
// export const HandlePromocodeValidate: RequestHandler = async (req, res) => {
//   try {
//     const { code, planId } = req.body;
//     // Validation
//     if (!code || typeof code !== 'string') {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Valid promo code is required" 
//       });
//     }
//     // Find active promo code (case insensitive)
//     const promo = await PromoCode.findOne({ 
//       code: code.toUpperCase().trim(), 
//       isActive: true 
//     });
//     if (!promo) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Invalid or inactive promo code" 
//       });
//     }
//     // Check expiration
//     const currentDate = new Date();
//     if (new Date(promo.validTill) < currentDate) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Promo code has expired" 
//       });
//     }
//     // Optional: Check if promo is valid for specific plan
//     if (planId) {
//       // Add plan-specific validation logic here if needed
//       console.log(`Validating promo ${promo.code} for plan ${planId}`);
//     }
//     return res.status(200).json({ 
//       success: true, 
//       message: "Promo code is valid",
//       data: promo 
//     });
//   } catch (err) {
//     console.error("Promo Validate Error:", err);
//     return res.status(500).json({ 
//       success: false, 
//       message: "Internal server error" 
//     });
//   }
// };
//# sourceMappingURL=Promocode_Controller.js.map