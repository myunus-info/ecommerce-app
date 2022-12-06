const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findById(productId);
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with Id '${productId}'`);
  }
  const reviewAlreadySubmitted = await Review.findOne({ product: productId, user: req.user.userId });
  if (reviewAlreadySubmitted) {
    throw new CustomError.BadRequestError('Review already submitted for this product');
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({ path: 'product', select: 'name company price' });
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError.NotFoundError(`No review with Id '${reviewId}'`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError.NotFoundError(`No review with Id '${reviewId}'`);
  }
  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json({ msg: 'Review successfully updated' });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError.NotFoundError(`No review with Id '${reviewId}'`);
  }
  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: 'Review successfully deleted' });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
