const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

router
  .route('/')
  .post(authenticateUser, orderController.createOrder)
  .get(authenticateUser, authorizePermissions('admin'), orderController.getAllOrders);

router.get('/showAllMyOrders', authenticateUser, orderController.getCurrentUserOrders);

router
  .route('/:id')
  .get(authenticateUser, orderController.getSingleOrder)
  .patch(authenticateUser, orderController.updateOrder);

module.exports = router;
