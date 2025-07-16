// routes/bookingRoutes.js
import express from "express";
import Booking from "../models/Bookings.js";
import  verifyAdmin from "../middleware/admin.middleware.js";
import  verifyUser  from "../middleware/auth.middleware.js";
import { sendEmail, sendSMS } from "../utils/notification.js";
const router = express.Router();

// Create a booking
router.post("/book", verifyUser, async (req, res) =>
{
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

// Get booked slots for a car
router.get("/slots/:carId", async (req, res) =>
{
    try {
        const { carId } = req.params;
        const bookings = await Booking.find({ carId }).select("startTime endTime");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching booked slots", error });
    }
});

router.get("/my-bookings", verifyUser, async (req, res) =>
{
    try {
        const bookings = await Booking.find({ userId: req.user.id }).populate("carId");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
});
  
  // Admin Booking Reports
router.get("/admin/reports", verifyAdmin, async (req, res) =>
{
    try {
        const bookings = await Booking.find().populate("userId").populate("carId");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reports", error });
    }
});

router.post("/cancel/:id", verifyUser, async (req, res) =>
{
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
