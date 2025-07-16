import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js"; // Adjust the path as needed
import dotenv from "dotenv";

dotenv.config();

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized You're not admin" });
      console.log("Your are not admin", token)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    const user = await Admin.findById(decoded.id);
    

    if (!user) {
      // console.log(user);
      
      return res.status(403).json({ message: "Access denied, Admins only" });
      console.log("Access denied, admins only logged in");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyAdmin;

// Export both functions correctly

