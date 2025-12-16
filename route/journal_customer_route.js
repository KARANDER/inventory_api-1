const express = require('express');
const router = express.Router();
const journalCustomerController = require('../controller/journal_customer_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

// All routes require authentication
router.use(authMiddleware);

// Use the same permission as journal entries
const permission = 'journal_entries';

// Get all customers (for dropdown)
router.post('/getAll', checkPermission(permission), journalCustomerController.getAll);

// Create customer
router.post('/', checkPermission(permission), journalCustomerController.create);

// Update customer
router.post('/update', checkPermission(permission), journalCustomerController.update);

// Delete customer
router.post('/delete', checkPermission(permission), journalCustomerController.delete);

module.exports = router;


