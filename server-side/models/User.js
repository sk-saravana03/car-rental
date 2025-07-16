import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // For encrypting sensitive data

const UserSchema = new mongoose.Schema(
  {
    fullName:
    {
      type: String,
      required: true
    },
    email:
    {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      
    },
    
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },
    profilePicture: { type: String, default: "" }, // Store image URL

    // Secure Aadhar Card & License Number (Encrypted)
    aadharNumber: { type: String },
    licenseNumber: { type: String },

    rentedCars: [
      {
        carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
        startDate: { type: Date },
        endDate: { type: Date },
        totalPrice: { type: Number },
        status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" }
      }
    ],
    paymentMethods: [
      {
        cardType: { type: String }, // Visa, Mastercard, etc.
        last4Digits: { type: String },
        expiry: { type: String }
      }
    ],
    transactionHistory: [
      {
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        method: { type: String },
        status: { type: String, enum: ["success", "failed", "pending"], default: "success" }
      }
    ],
    

  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// **Middleware to Hash Aadhar & License Before Saving**
UserSchema.pre("save", async function (next)
{
  if (this.isModified("aadharNumber")) {
    const salt = await bcrypt.genSalt(10);
    this.aadharNumber = await bcrypt.hash(this.aadharNumber, salt);
  }
  if (this.isModified("licenseNumber")) {
    const salt = await bcrypt.genSalt(10);
    this.licenseNumber = await bcrypt.hash(this.licenseNumber, salt);
  }
  next();
});

// **Method to Compare Encrypted Aadhar/License**
UserSchema.methods.compareAadhar = async function (aadhar)
{
  return await bcrypt.compare(aadhar, this.aadharNumber);
};

UserSchema.methods.compareLicense = async function (license)
{
  return await bcrypt.compare(license, this.licenseNumber);
};

export default mongoose.model("User", UserSchema);
