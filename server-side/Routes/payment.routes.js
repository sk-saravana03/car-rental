import express from "express";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js"; // Ensure the user model is correctly imported

dotenv.config();
const router = express.Router();

// Initialize Stripe & Razorpay
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// **Stripe Payment**
router.post("/stripe", async (req, res) => {
  try {
    const { userId, amount, currency, paymentMethodId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      payment_method: paymentMethodId,
      confirm: true,
    });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.transactionHistory.push({
      amount,
      method: "Stripe",
      status: "success",
    });

    await user.save();
    res.json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// **Razorpay Payment**
router.post("/razorpay", async (req, res) => {
  try {
    const { userId, amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `order_rcptid_${userId}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// **Razorpay Payment Verification**
router.post("/razorpay/verify", async (req, res) => {
  try {
    const { userId, order_id, payment_id, signature, amount } = req.body;

    const body = order_id + "|" + payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signature)
      return res.status(400).json({ success: false, message: "Invalid signature" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.transactionHistory.push({
      amount,
      method: "Razorpay",
      status: "success",
    });

    await user.save();
    res.json({ success: true, message: "Payment verified" });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
