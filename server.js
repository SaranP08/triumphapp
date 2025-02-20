require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const bikeRoutes = require("./routes/bikes");

const app = express();
app.use(express.json());

// ✅ Allow CORS for all requests (important for Cordova)
app.use(
  cors({
    origin: "*", // Allow any domain
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/", authRoutes);
app.use("/api", bikeRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
