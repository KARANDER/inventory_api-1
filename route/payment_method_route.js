const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controller/payment_method_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

// All routes require authentication
router.use(authMiddleware);

// Define permission for payment methods (using 'journal_entries' permission)
const permission = 'journal_entries';

// Get all payment methods
router.post('/getAll', checkPermission(permission), paymentMethodController.getAll);

// Create new payment method
router.post('/', checkPermission(permission), paymentMethodController.create);

// Update payment method
router.post('/update', checkPermission(permission), paymentMethodController.update);

// Delete payment method
router.post('/delete', checkPermission(permission), paymentMethodController.delete);

module.exports = router;


