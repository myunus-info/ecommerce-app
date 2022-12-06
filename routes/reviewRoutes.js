const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateUser } = require('../middleware/authentication');

router
  .route('/')
  .post(authenticateUser, reviewController.createReview)
  .get(reviewController.getAllReviews);

router
  .route('/:id')
  .get(reviewController.getSingleReview)
  .patch(authenticateUser, reviewController.updateReview)
  .delete(authenticateUser, reviewController.deleteReview);

module.exports = router;
