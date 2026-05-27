// server.js
require("dotenv").config();
const express = require("express");
const { moderateMessage } = require("./moderator");

const app = express();
app.use(express.json());

app.post("/moderate", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'message' field" });
  }

  if (message.trim().length === 0) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  try {
    const verdict = await moderateMessage(message);
    return res.json({ message, verdict });
  } catch (err) {
    console.error("Moderation failed:", err.message);
    return res.status(500).json({ error: "Moderation service error", details: err.message });
  }
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Moderation API running on http://localhost:${PORT}`);
  console.log(`POST /moderate  →  { "message": "your text here" }`);
});