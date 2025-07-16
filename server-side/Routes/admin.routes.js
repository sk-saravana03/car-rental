import express from "express";
import  verifyUser  from "../middleware/auth.middleware.js";
import  verifyAdmin  from "../middleware/admin.middleware.js";
import { sendEmail, sendSMS } from "../utils/notification.js";
import Booking from "../models/Bookings.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Admin Registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) { 
      console.log("PASSWORD DO NOT MATCH")
      return res.status(400).json({ message: "passwords do no match " });
    };


    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, email, password: hashedPassword });
    await admin.save();

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error });
    console.log("Error : ", error);
  }
});

// Admin Login
router.post("/login", async (req, res) =>
{
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin"
      }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      message: "Login successfully",
      token,
      user: { id: admin._id, email: admin.email, role: "admin" }
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// User Booking History
router.get("/my-bookings", verifyUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate("carId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

// Admin Booking Reports
router.get("/admin/reports", verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId").populate("carId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error });
  }
});

// Booking Confirmation
router.post("/book", verifyUser, async (req, res) => {
  try {
    const { carId, startTime, endTime } = req.body;
    const booking = new Booking({ userId: req.user.id, carId, startTime, endTime });
    await booking.save();

    // Send email & SMS notification
    const userEmail = req.user.email;
    const userPhone = req.user.phone;
    await sendEmail(userEmail, "Booking Confirmed", "Your car booking has been confirmed.");
    await sendSMS(userPhone, "Your car booking has been confirmed.");

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (error) {
    res.status(500).json({ message: "Error confirming booking", error });
  }
});

// Booking Cancellation
router.post("/cancel/:id", verifyUser, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "Cancelled";
    await booking.save();

    // Send email & SMS notification
    const userEmail = req.user.email;
    const userPhone = req.user.phone;
    await sendEmail(userEmail, "Booking Cancelled", "Your car booking has been cancelled.");
    await sendSMS(userPhone, "Your car booking has been cancelled.");

    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking", error });
  }
});

export default router;
