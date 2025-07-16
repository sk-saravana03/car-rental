import express from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Multer Storage for Profile Picture Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}_${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Get User Profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -aadharNumber -licenseNumber");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update Basic Information
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
});

// Upload Profile Picture
router.put("/upload-profile", verifyToken, upload.single("profilePicture"), async (req, res) => {
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { profilePicture: imageUrl }, { new: true });
    res.status(200).json({ message: "Profile picture updated", profilePicture: imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
});

// Update Secure Aadhar & License
router.put("/update-documents", verifyToken, async (req, res) =>
{
    try {
        const { aadharNumber, licenseNumber } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedAadhar = await bcrypt.hash(aadharNumber, salt);
        const hashedLicense = await bcrypt.hash(licenseNumber, salt);
        await User.findByIdAndUpdate(req.user.id, { aadharNumber: hashedAadhar, licenseNumber: hashedLicense });
        res.status(200).json({ message: "Documents updated securely" });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error });
    }
});

// Delete User Account
router.delete("/delete", verifyToken, async (req, res) =>
{
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
  
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Account deletion failed", error });
    }
});
  

export default router;
