import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./Routes/auth.routes.js"; 
import adminRoutes from "./Routes/admin.routes.js";
import bookingRoutes from "./Routes/booking.routes.js";
import carRoutes from "./Routes/car.routes.js";
import userRoute from "./Routes/user.routes.js"
import paymentRoutes from "./Routes/payment.routes.js"

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.log("JWT_SECRET is not defined or invalid");
};

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/car", carRoutes);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.use("/", (req, res) => {
  res.send(`Backend is working! ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error));
