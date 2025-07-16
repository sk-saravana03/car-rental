import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  transmission: { type: String, enum: ["Automatic", "Manual"], required: true },
  fuel: { type: String, enum: ["Petrol", "Diesel", "Electric"], required: true },
  mileage: { type: Number, required: true },
  maxPassengers: { type: Number, required: true },
  lastService: {type:Date},
  rentPerDay: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  image: {type: String, default: null},
  // tags: { type: [String], default: [] }, // Added tags field
}, { timestamps: true });

const Car = mongoose.model("Car", carSchema);
export default Car;
