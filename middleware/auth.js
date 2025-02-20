const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("🔻 No valid Authorization header provided.");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔹 Extracted Token:", token);

  try {
    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables.");
      return res.status(500).json({ error: "Server misconfiguration." });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified:", verified);

    req.user = verified;
    next();
  } catch (err) {
    console.error("❌ Token Verification Failed:", err);

    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Session expired. Please log in again." });
    }

    return res.status(400).json({ error: "Invalid token." });
  }
};
