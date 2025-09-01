import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaUser, FaCalendarAlt } from 'react-icons/fa';
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import './Reviews.css';
import { message } from "antd";


const ReviewsAndRatings = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserId = localStorage.getItem("userId");
  const currentUserName = localStorage.getItem("userName");
  const [messageApi, contextHolder] = message.useMessage();


  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  // Calculate overall rating
  const overallRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const StarRating = ({ rating, size = 20, interactive = false, onRate = null }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <FaStar
            key={star}
            size={size}
            color={star <= rating ? '#FFD700' : '#374151'}
            className={`star ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  // Add new review
  const handleSubmitReview = async () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      messageApi.warning("Please provide both a rating and a comment ⚠️");
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/reviews`,
        {
          userId: currentUserId,
          username: currentUserName,
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setReviews([res.data, ...reviews]);
      setNewReview({ rating: 0, comment: '' });
      messageApi.success("Your review has been submitted");
    } catch (err) {
      console.error("Error adding review:", err);
      messageApi.error("Failed to submit review ");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div style={{ backgroundColor: "white", minHeight: "190vh" }}>
      {contextHolder}
      <NavigationBar />
      <div className="reviews-ratings-container">
        {/* Header */}
        <div className="welcome-section">
          <h1>Reviews & Ratings</h1>
          <p>Share your experience and read what others say about our service</p>
        </div>

        <div className="main-content">
          {/* Left Column */}
          <div className="dashboard-section left-column">
            <h2 className="rating-summary-title">Rating Summary</h2>
            <div className="overall-rating">
              <div className="overall-rating-number">{overallRating}</div>
              <StarRating rating={Math.round(overallRating)} size={30} />
              <p className="overall-rating-text">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div>
              <h3 className="rating-distribution-title">Rating Distribution</h3>
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="rating-distribution-item">
                  <span className="rating-number">{rating}</span>
                  <FaStar color="#FFD700" size={16} />
                  <div className="rating-bar">
                    <div className="rating-bar-fill" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="rating-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="dashboard-section right-column">
            <h2 className="customer-reviews-title">Customer Reviews</h2>

            {/* Write Review */}
            <div className="review-form">
              <h3 className="write-review-title">Write a Review</h3>
              <div className="rating-input">
                <label className="input-label">Your Rating</label>
                <StarRating
                  rating={newReview.rating}
                  size={30}
                  interactive={true}
                  onRate={(rating) => setNewReview({ ...newReview, rating })}
                />
              </div>
              <div className="comment-input">
                <label className="input-label">Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with our service..."
                  className="review-textarea"
                  rows={4}
                />
              </div>
              <button onClick={handleSubmitReview} disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>

            {/* Reviews List */}
            <div style={{ marginTop: '40px' }}>
              <div className="reviews-header">
                <h3 className="reviews-title">Reviews ({reviews.length})</h3>
              </div>

              {reviews.length === 0 ? (
                <div className="empty-state">
                  <FaUser style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />
                  <p>No reviews found</p>
                </div>
              ) : (
                <div className="reviews-container">
                  {reviews.map(review => (
                    <div key={review.reviewId} className="review-card">
                      <div className="review-header">
                        <div className="review-user-info">
                          <div className="user-avatar"><FaUser /></div>
                          <div className="review-user-details">
                            <h4>{review.username}</h4>
                            <div className="review-user-meta">
                              <StarRating rating={review.rating} size={16} />
                              <span className="review-date">
                                <FaCalendarAlt style={{ marginRight: '5px' }} />
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsAndRatings;
