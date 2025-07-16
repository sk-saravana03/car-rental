import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Adjust the path as needed
import dotenv from "dotenv";

dotenv.config();

const verifyUser = async (req, res, next) =>
{
    try {
      const token = req.header("Authorization")?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
  
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
  
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
};
  
export default verifyUser;