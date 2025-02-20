require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const bikeRoutes = require("./routes/bikes");
const authenticateToken = require("./middleware/auth"); // ✅ Import authentication middleware

const app = express();
app.use(express.json());

// ✅ Simple Middleware to Log API Requests
app.use((req, res, next) => {
  console.log(`📡 ${req.method} Request to ${req.url}`);
  next();
});

// ✅ Allow CORS for all requests (important for Cordova)
app.use(
  cors({
    origin: "*", // ✅ Allow any domain
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // ✅ Added PUT & PATCH
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/", authRoutes);
app.use("/api", bikeRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Profile Route - Requires Authentication
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user); // ✅ Send user details
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
