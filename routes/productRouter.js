const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { getSingleProductReviews } = require('../controllers/reviewController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

router
  .route('/')
  .post([authenticateUser, authorizePermissions('admin')], productController.createProduct)
  .get(productController.getAllProducts);

router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin')], productController.uploadImage);

router
  .route('/:id')
  .get(productController.getSingleProduct)
  .patch([authenticateUser, authorizePermissions('admin')], productController.updateProduct)
  .delete([authenticateUser, authorizePermissions('admin')], productController.deleteProduct);

router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;
