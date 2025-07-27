import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"});
  }
};

// Middleware to verify admin role
export const verifyAdmin = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(403).json({ success: false, message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(403).json({ success: false, message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }

    req.user = user; // Optional: attach user info to request
    req.body.userId = user._id; // Attach userId for later use
    next();
  } catch (error) {
    console.error("verifyAdmin Error:", error);
    res.status(403).json({ success: false, message: "Unauthorized: Token verification failed" });
  }
};

export default authMiddleware;