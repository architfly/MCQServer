import { RequestHandler } from "express";
import Plan from "../../Modal/Plan";

export const HandlePlanCreate: RequestHandler = async (req, res) => {
  try {
    const { name, duration, price } = req.body;

    if (!name || !duration || !price) {
      return res.status(400).json({
        success: true,
        message: "there is filled khali hai",
      });
    }

    const Plancreated = await Plan.create({ name, duration, price });

    if (!Plancreated) {
      return res.status(400).json({
        success: false,
        message: "plan is not created",
      });
    }

    return res.status(201).json({
      success: true,
      message: "successfully created",
      data: Plancreated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "there is error in the HandlePlancreate",
    });
  }
};

export const HandlePlanDelete: RequestHandler = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "error in planId",
      });
    }

    const deleteId = await Plan.findByIdAndDelete(planId );

    if (!deleteId) {
      return res.status(400).json({
        success: false,
        message: "there is deleteId error",
      });
    }

    return res.status(200).json({
      success: true,
      message: "there is error handlePlanId",
      data: deleteId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      message: "error in this handle",
      error,
    });
  }
};

export const HandlePlanEdit: RequestHandler = async (req, res) => {
  try {
    const {PlanId}  = req.params;
    console.log("planId",req.params)
    if (!PlanId) {
      return res.status(400).json({
        success: false,
        message: "planId is empty",
      });
    }
    const { name, duration, price } = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(
      PlanId,
      { name, duration, price },
      { new: true } // return the updated document
    );

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "there is edit api",
      data:updatedPlan
    });
  } catch (error) {
    console.log("HandlePlanEdit error", error);
    return res.status(500).json({
      success: false,
      message: "error in thgis HandleEditpAlna",
    });
  }
};

export const HandlePlanGet: RequestHandler = async (req, res) => {
  try {
    const PlanToGet = await Plan.find({});

    if (!PlanToGet) {
      return res.status(400).json({
        success: false,
        message: "not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All data fertch successfully",
      data: PlanToGet,
    });
  } catch (error) {
    console.log("HandlePlanGet", error);
    return res.status(500).json({
      success: true,
      message: "error there Handle Plan Get",
    });
  }
};
