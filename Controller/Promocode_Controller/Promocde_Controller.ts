import { RequestHandler } from "express";
import PromoCode from "../../Modal/Promocode";

export const HandlePromocodeCreate: RequestHandler = async (req, res) => {
  try {
    const { code, discount, validTill, inActive } = req.body;


    // if (!code || !discount || !validTill || !inActive) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "all data complete it",
    //   });
    // }

    const PromoCodeALways = await PromoCode.create({
      code,
      discount,
      validTill,
      inActive,
    });

    if (!PromoCodeALways) {
      return res.status(400).json({
        success: false,
        message: "Prcomcode is inavlid",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Promocode is Succesffuly created",
      data: PromoCodeALways,
    });
  } catch (error) {
    console.log("HandkePromocode", error);
    return res.status(500).json({
      success: false,
      message: "error in the Handkeprmocde",
    });
  }
};

export const HandlePromocodeGet: RequestHandler = async (req, res) => {
  try {
    const allPromocode = await PromoCode.find({});

    if (!allPromocode) {
      return res.status(400).json({
        success: false,
        message: "there is true in all data",
      });
    }

    return res.status(200).json({
      success: true,
      message: "successfully fetch it okay",
      data:allPromocode
    });
  } catch (error) {
    console.log("handlepromocedieGet", error);
    return res.status(400).json({
      success: false,
      message: "Handle create error",
    });
  }
};

export const HandlePromoCodeEdit: RequestHandler = async (req, res) => {
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

    const PromocodeApply = await PromoCode.findByIdAndUpdate(
      promoId,
      { code, discount, validTill, isActive },
      { new: true }
    );

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
  } catch (error) {
    console.log("handle Error ine edit", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const HandlePromoCodeDelete: RequestHandler = async (req, res) => {
  try {
    const { promoId } = req.params;

    if (!promoId) {
      return res.status(400).json({
        success: false,
        message: "promoId is required",
      });
    }

    const deletedPromo = await PromoCode.findByIdAndDelete(promoId);

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
  } catch (error) {
    console.error("HandlePromoCodeDelete error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting promocode",
    });
  }
};
