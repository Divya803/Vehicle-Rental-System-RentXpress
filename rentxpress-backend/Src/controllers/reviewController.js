const AppDataSource = require("../config/config");
const Review = require("../models/review");
const {getRepository} = require("typeorm");

// ✅ Get all reviews
const getReviews = async (req, res) => {
  try {
    const reviewRepo = AppDataSource.getRepository(Review);
    const reviews = await reviewRepo.find({ order: { createdAt: "DESC" } });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// ✅ Add a review
const createReview = async (req, res) => {
  try {
    const { userId, username, rating, comment } = req.body;

    if (!userId || !username || !rating || !comment) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const reviewRepo = AppDataSource.getRepository(Review);
    const newReview = reviewRepo.create({ userId, username, rating, comment });

    await reviewRepo.save(newReview);
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add review" });
  }
};


// ✅ Delete a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const reviewRepo = AppDataSource.getRepository(Review);
    const review = await reviewRepo.findOne({ where: { reviewId: id } });

    if (!review) return res.status(404).json({ error: "Review not found" });

    await reviewRepo.remove(review);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

module.exports = { getReviews, createReview, updateReview, deleteReview };
