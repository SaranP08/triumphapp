require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const bikeRoutes = require("./routes/bikes");
const auth = require("./middleware/auth"); // ✅ Fixed import
const User = require("./models/user"); // ✅ Fixed missing User model

const app = express();
app.use(express.json());

// ✅ Improved Middleware to Log API Requests (Excludes Profile)
app.use((req, res, next) => {
  if (req.url !== "/api/profile") {
    console.log(`📡 ${req.method} Request to ${req.url}`);
  }
  next();
});

// ✅ Allow CORS for All Requests (Important for Cordova)
app.use(
  cors({
    origin: "*", // ✅ Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // ✅ Added PUT & PATCH
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Ensure Authorization is allowed
  })
);

// ✅ Routes
app.use("/", authRoutes);
app.use("/api", bikeRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Fixed: Profile Route Now Uses `/api/profile`
app.get("/api/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // ✅ Hide password
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) =>
    console.error("❌ MongoDB Connection Failed:", error.message)
  );

// ✅ Simple Route to Check API Status
app.get("/", (req, res) => {
  res.send("API is Running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
