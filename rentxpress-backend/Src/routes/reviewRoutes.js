const express = require("express");
const {
  getReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/", getReviews);
router.post("/", createReview);
router.delete("/:id", deleteReview);

module.exports = router;
