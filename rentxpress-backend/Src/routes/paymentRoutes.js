const express = require("express");
const { createCheckoutSession , verifySession, webhookHandler } = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.get("/verify-session/:sessionId", verifySession);


module.exports = router;
