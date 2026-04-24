const express = require('express');
const router = express.Router();
const salesLockController = require('../controller/sales_lock_controller');
const { authenticateToken } = require('../middlewares/auth');

// Get current lock status
router.get('/status', authenticateToken, salesLockController.getStatus);

// Toggle lock ON/OFF
router.post('/toggle', authenticateToken, salesLockController.toggleLock);

module.exports = router;