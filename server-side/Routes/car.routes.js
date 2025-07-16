import express from "express";
import multer from "multer";
import path from "path";
import Car from "../models/Car.js";
import verifyAdmin from "../middleware/admin.middleware.js";
import fs from "fs";


const router = express.Router();

// Configure multer for file uploads

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
  {
    const dir = "uploads/cars/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) =>
  {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
// Add a new car (Admin only)
router.post("/add", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { brand, model, year, fuel, transmission, rentPerDay, maxPassengers, lastService, mileage } = req.body;
    const imagePath = req.file ? `/uploads/cars/${req.file.filename}` : null;
    console.log(imagePath)
    if (!model || !brand || !year || !fuel || !transmission || !rentPerDay || !maxPassengers || !lastService || !mileage) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log(req.file)


    const newCar = new Car({
      brand,
      model,
      year,
      fuel,
      transmission,
      rentPerDay,
      maxPassengers,
      lastService,
      mileage,
      // tags: tags ? tags.split(",") : [],
      image: imagePath
    });

    


    await newCar.save();
    res.status(201).json({ message: "Car added successfully", car: newCar });
    console.log(newCar)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error adding car", error });
  }
});

// Get all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      console.log("car is not found")
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Filter and search cars
router.get("/search", async (req, res) =>
{
  try {
    const { name, brand, year, fuel, transmission, minRent, maxRent } = req.query;

    let filter = {};

    if (name) filter.name = { $regex: name, $options: "i" };
    if (brand) filter.brand = { $regex: brand, $options: "i" };
    if (year) filter.year = year;
    if (fuel) filter.fuel = fuel;
    if (transmission) filter.transmission = transmission;
    if (minRent || maxRent) {
      filter.rentPerDay = {};
      if (minRent) filter.rentPerDay.$gte = Number(minRent);
      if (maxRent) filter.rentPerDay.$lte = Number(maxRent);
    }

    const cars = await Car.find(filter);
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars", error });
  }
});


// Update car details (Admin only)
router.put("/edit/:id", verifyAdmin, upload.single("image"), async (req, res) =>
{
  try {
    const { id } = req.params;
    const { name, brand, year, fuel, transmission, rentPerDay, maxPassengers, lastService, mileage, tags } = req.body;

    const existingCar = await Car.findById(id);
    if (!existingCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    let updatedData = {
      name,
      brand,
      year,
      fuel,
      transmission,
      rentPerDay,
      maxPassengers,
      lastService,
      mileage,
      tags: tags ? tags.split(",") : [],
    };

    // If a new image is uploaded, update the image path
    if (req.file) {
      // Delete the old image
      if (existingCar.image) {
        const oldImagePath = `.${existingCar.image}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updatedData.image = `/uploads/cars/${req.file.filename}`;
    }

    const updatedCar = await Car.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: "Car updated successfully", car: updatedCar });
  } catch (error) {
    res.status(500).json({ message: "Error updating car", error });
  }
});

// Delete a car (Admin only)
router.delete("/delete/:id", verifyAdmin, async (req, res) =>
{
  try {
    const { id } = req.params;

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Delete the image file
    if (car.image) {
      const imagePath = `.${car.image}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Car.findByIdAndDelete(id);
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car", error });
  }
});



export default router;
