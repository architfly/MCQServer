import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtUserPayload } from "../express";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["x-auth-token"] as string;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No Token Provided",
      });
    }

    // Use verify instead of sign
    const decoded = jwt.verify(
      token,
      process.env.SECRET_JWT as string
    ) as JwtUserPayload;
    req.user = decoded; // decoded now contains id, email, role
    next();
  } catch (error) {
    console.log("err in isAuth", error);
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};
