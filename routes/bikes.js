//routes/bikes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Bike = require("../models/Bikes"); // Corrected model name
const User = require("../models/user"); // Import User model
const auth = require("../middleware/auth"); // Import auth middleware

const router = express.Router();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// =======================
// POST /api/bikes - Add a new bike (Protected)
// =======================
router.post("/bikes", auth, upload.single("image"), async (req, res) => {
  const { name, kms } = req.body; // Get data from request
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

  try {
    // Fetch user details from DB using user ID from auth middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newBike = new Bike({
      userName: user.name, // Store userName instead of userId
      bikeName: name,
      kmsDriven: kms,
      imageUrl: `/api/uploads/${req.file.filename}`, // ✅ Corrected image URL
    });

    await newBike.save();
    res.status(201).json({ message: "Bike added successfully", bike: newBike });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding bike" });
  }
});

// =======================
// GET /api/bikes - Get all bikes for the logged-in user
// =======================
router.get("/bikes", auth, async (req, res) => {
  try {
    // Fetch user details from DB using user ID from auth middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bikes = await Bike.find({ userName: user.name }); // Filter by userName
    res.status(200).json(bikes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching bikes" });
  }
});

module.exports = router;
