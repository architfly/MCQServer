"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleGetTotalUsers = exports.HandleDeleteUser = exports.HandleGetUser = exports.HandleEditUser = exports.HandleLogin = exports.HandleSignup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../Modal/User"));
// Signup (Register)
const HandleSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone_number, country, role, } = req.body;
        // Check if user exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }
        // Create new user (password stored as plain text - not safe in real apps)
        const newUser = new User_1.default({
            firstName,
            lastName,
            email,
            password,
            phone_number,
            country,
            role,
        });
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.HandleSignup = HandleSignup;
// Login
const HandleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check user exists
        const user = await User_1.default.findOne({ email });
        if (!user || user.password !== password) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid email or password" });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, process.env.SECRET_JWT, { expiresIn: "30d" });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.HandleLogin = HandleLogin;
const HandleEditUser = async (req, res) => {
    try {
        // Ensure req.user exists and is admin
        const userPayload = req.user?.role;
        console.log("ye hia admin", userPayload);
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        const { userId } = req.params;
        const { firstName, lastName, email, phone_number, country, role } = req.body;
        // Find user by ID
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Update fields if provided
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (email)
            user.email = email;
        if (phone_number)
            user.phone_number = phone_number;
        if (country)
            user.country = country;
        if (role && (role === "user" || role === "admin"))
            user.role = role;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user,
        });
    }
    catch (error) {
        console.error("Edit User error:", error);
        return res.status(500).json({
            success: false,
            message: "Error editing user",
        });
    }
};
exports.HandleEditUser = HandleEditUser;
const HandleGetUser = async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "only admin can access",
            });
        }
        const allUser = await User_1.default.find();
        if (!allUser) {
            return res.status(403).json({
                success: false,
                message: "no data found",
            });
        }
        return res.status(201).json({
            success: true,
            message: "successfully data fetch",
            data: allUser,
        });
    }
    catch (error) {
        console.log("ye error Handle get ka", error);
        return res.status(500).json({
            success: false,
            message: "error in Handle get user",
        });
    }
};
exports.HandleGetUser = HandleGetUser;
const HandleDeleteUser = async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "only admin can delete it",
            });
        }
        const { userId } = req.params;
        const deleteUser = await User_1.default.findByIdAndDelete({ userId });
        if (!deleteUser) {
            return res.status(403).json({
                success: false,
                message: "delete user null data",
            });
        }
        return res.status(201).json({
            success: true,
            message: "delete user successfully",
            data: deleteUser,
        });
    }
    catch (error) {
        console.log("error in Handle Delte", error);
        return res.status(500).json({
            success: false,
            message: "error in HandleDelteUser",
        });
    }
};
exports.HandleDeleteUser = HandleDeleteUser;
// Get Total Users
const HandleGetTotalUsers = async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "only admin can access total users",
            });
        }
        // Count total users
        const totalUsers = await User_1.default.countDocuments();
        return res.status(200).json({
            success: true,
            message: "Total users fetched successfully",
            total: totalUsers,
        });
    }
    catch (error) {
        console.error("Error in HandleGetTotalUsers:", error);
        return res.status(500).json({
            success: false,
            message: "error in HandleGetTotalUsers",
        });
    }
};
exports.HandleGetTotalUsers = HandleGetTotalUsers;
//# sourceMappingURL=User_Controller.js.map