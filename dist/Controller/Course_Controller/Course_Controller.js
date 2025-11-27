"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleCourseGetAll = exports.HandleCourseEdit = exports.HandleCourseDelete = exports.HandleCourseAdd = void 0;
const Course_1 = __importDefault(require("../../Modal/Course"));
const HandleCourseAdd = async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            console.log("req.user?.role", req.user?.role);
            return res.status(401).json({
                success: false,
                message: "this is admin can access it",
            });
        }
        const { courseName, courseCode, description } = req.body;
        if (!courseName || !courseCode || !description) {
            return res.status(400).json({
                success: false,
                message: "all field requuried",
            });
        }
        const courseCreate = await Course_1.default.create({
            courseName,
            courseCode,
            description,
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
    }
    catch (error) {
        console.log("error in HandleCouse Add", error);
        return res.status(500).json({
            success: false,
            message: "error in handleCourse",
        });
    }
};
exports.HandleCourseAdd = HandleCourseAdd;
const HandleCourseDelete = async (req, res) => {
    try {
        if (req?.user?.role !== "admin") {
            return res.status(400).json({
                success: false,
                message: "only admin can access it",
            });
        }
        const { courseId } = req.params;
        console.log("ye hai 1", courseId);
        const courseKIiddelte = await Course_1.default.findByIdAndDelete(courseId);
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
    }
    catch (error) {
        console.log("Handle course delete", error);
        return res.status(500).json({
            success: false,
            message: "Handle Cuorse error",
        });
    }
};
exports.HandleCourseDelete = HandleCourseDelete;
const HandleCourseEdit = async (req, res) => {
    try {
        if (req?.user?.role !== "admin") {
            return res.status(400).json({
                success: false,
                messsage: "only admin can access it",
            });
        }
        const { courseId } = req.params;
        const { courseName, courseCode, description } = req.body;
        const EditCourse = await Course_1.default.findByIdAndUpdate(courseId, { courseName, courseCode, description }, { new: true });
        return res.status(200).json({
            success: true,
            message: "Successfully edited",
            data: EditCourse,
        });
    }
    catch (error) {
        console.log("error in handlcourse", error);
        return res.status(500).json({
            success: false,
            message: "error in handle COurse edit",
        });
    }
};
exports.HandleCourseEdit = HandleCourseEdit;
const HandleCourseGetAll = async (req, res) => {
    try {
        // if (req.user?.role !== "admin") {
        //   return res.status(400).json({
        //     success: false,
        //     message: "Only admin can access",
        //   });
        // }
        // else(req.user?.role !==)
        const CourseGetll = await Course_1.default.find();
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
    }
    catch (error) {
        console.log("error in HandleCourseGetall", error);
        return res.status(500).json({
            success: false,
            message: "Error in GetAll Course",
        });
    }
};
exports.HandleCourseGetAll = HandleCourseGetAll;
//# sourceMappingURL=Course_Controller.js.map