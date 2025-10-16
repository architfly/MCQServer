import { Request, Response } from "express";
import Course from "../../Modal/Course";
import { runInThisContext } from "vm";

export const HandleCourseAdd = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      console.log("req.user?.role", req.user?.role);
      return res.status(401).json({
        success: false,
        message: "this is admin can access it",
      });
    }

    const { courseName, courseCode, description, duration } = req.body;

    if (!courseName || !courseCode || !description || !duration) {
      return res.status(400).json({
        success: false,
        message: "all field requuried",
      });
    }

    const courseCreate = await Course.create({
      courseName,
      courseCode,
      description,
      duration,
    });

    if (!courseCreate) {
      return res.status(401).json({
        success: false,
        message: "creattion of course is no data",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Course created Successfully",
      data: courseCreate,
    });
  } catch (error) {
    console.log("error in HandleCouse Add", error);
    return res.status(500).json({
      success: false,
      message: "error in handleCourse",
    });
  }
};

export const HandleCourseDelete = async (req: Request, res: Response) => {
  try {
    if (req?.user?.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "only admin can access it",
      });
    }

    const { courseId } = req.params;

    console.log("ye hai 1", courseId);

    const courseKIiddelte = await Course.findByIdAndDelete(courseId);
    console.log("ye hai 1", courseKIiddelte);

    if (!courseKIiddelte) {
      return res.status(400).json({
        succes: false,
        message: "error in deleting not available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "deleted successfully",
      data: courseKIiddelte,
    });
  } catch (error) {
    console.log("Handle course delete", error);
    return res.status(500).json({
      success: false,
      message: "Handle Cuorse error",
    });
  }
};

export const HandleCourseEdit = async (req: Request, res: Response) => {
  try {
    if (req?.user?.role !== "admin") {
      return res.status(400).json({
        success: false,
        messsage: "only admin can access it",
      });
    }

    const { courseId } = req.params;
    const { courseName, courseCode, description, duration } = req.body;

    const EditCourse = await Course.findByIdAndUpdate(
      courseId,
      { courseName, courseCode, description, duration },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully edited",
      data: EditCourse,
    });
  } catch (error) {
    console.log("error in handlcourse", error);
    return res.status(500).json({
      success: false,
      message: "error in handle COurse edit",
    });
  }
};

export const HandleCourseGetAll = async (req: Request, res: Response) => {
  try {
    // if (req.user?.role !== "admin") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Only admin can access",
    //   });
    // }
    // else(req.user?.role !==)

    const CourseGetll = await Course.find();
    if (!CourseGetll) {
      return res.status(400).json({
        success: false,
        message: "CourseGett Not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course Get All succesfully fetch",
      data: CourseGetll,
    });
  } catch (error) {
    console.log("error in HandleCourseGetall", error);
    return res.status(500).json({
      success: false,
      message: "Error in GetAll Course",
    });
  }
};
