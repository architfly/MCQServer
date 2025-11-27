"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => {
    try {
        const token = req.headers["x-auth-token"];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No Token Provided",
            });
        }
        // Use verify instead of sign
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT);
        req.user = decoded; // decoded now contains id, email, role
        next();
    }
    catch (error) {
        console.log("err in isAuth", error);
        return res.status(403).json({
            success: false,
            message: "Invalid token",
        });
    }
};
exports.isAuth = isAuth;
//# sourceMappingURL=Auth.js.map