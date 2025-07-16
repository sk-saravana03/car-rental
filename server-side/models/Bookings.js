// models/Booking.js
import mongoose from "mongoose";

// Booking Schema for history and reports
const bookingSchema = new mongoose.Schema({
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    carId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true
    },
    startTime:
    {
        type: Date,
        required: true
    },
    endTime:
    {
        type: Date,
        required: true
    },
    status:
    {
        type: String,
        enum: ["Confirmed", "Completed", "Cancelled"], default: "Confirmed"
    },
  }, { timestamps: true });
  
  const Booking = mongoose.model("Booking", bookingSchema);
  export default Booking;
  
