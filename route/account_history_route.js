const express = require('express');
const router = express.Router();
const accountHistoryController = require('../controller/account_history_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

const permission = 'accounts'; // Using accounts permission

// Get account history for a specific account
router.post('/getAccountHistory', checkPermission(permission), accountHistoryController.getAccountHistory);

// Get all account history (across all accounts)
router.post('/getAllAccountHistory', checkPermission(permission), accountHistoryController.getAllAccountHistory);

// Get account summary with statistics
router.post('/getAccountSummary', checkPermission(permission), accountHistoryController.getAccountSummary);

// Get account history by account name (e.g., "NO_1")
router.post('/getAccountHistoryByName', checkPermission(permission), accountHistoryController.getAccountHistoryByName);

module.exports = router;

