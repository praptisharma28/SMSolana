globalThis.global = globalThis;
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

// Import modular handlers
const messageHandler = require("./src/messageHandler");
const { sendMessage } = require("./src/messageHandler");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Initialize Twilio
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Webhook endpoints
app.post("/sms", async (req, res) => {
  try {
    const response = await messageHandler.handleMessage(
      req.body.From,
      req.body.Body
    );
    await sendMessage(req.body.From, response, client);
    res.send("<Response></Response>");
  } catch (error) {
    console.error("SMS webhook error:", error);
    res.status(500).send("<Response></Response>");
  }
});

app.post("/whatsapp", async (req, res) => {
  try {
    const response = await messageHandler.handleMessage(
      req.body.From,
      req.body.Body
    );
    await sendMessage(req.body.From, response, client);
    res.send("<Response></Response>");
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    res.status(500).send("<Response></Response>");
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  const userManager = require("./src/userManager");
  res.json({
    status: "healthy",
    users: userManager.getUserCount(),
    uptime: process.uptime(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Web3 SMS Onboarding Bot running on port ${PORT}`);
  console.log(`📱 Users can text commands to get started with Solana!`);
});
