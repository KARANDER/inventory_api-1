const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const salesLockController = require('../controller/sales_lock_controller');

// Get all module lock statuses
router.get('/all', authenticateToken, salesLockController.getAllStatuses);

// Get lock status for a specific module
router.post('/status', authenticateToken, salesLockController.getStatus);

// Toggle lock ON/OFF for a specific module
router.post('/toggle', authenticateToken, salesLockController.toggleLock);

module.exports = router;