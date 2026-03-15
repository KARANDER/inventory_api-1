const express = require('express');
const router = express.Router();
const accountController = require('../controller/account_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

const permission = 'accounts'; // Assuming the permission is named 'accounts'

// Renamed routes for clarity and consistency
router.post('/', checkPermission(permission), accountController.createAccount);
router.post('/getAllAccount', checkPermission(permission), accountController.getAllAccounts);

// --- NEW: Routes for update and delete ---
router.post('/updateAccount', checkPermission(permission), accountController.updateAccount);
router.post('/deleteAccount', checkPermission(permission), accountController.deleteAccount);

// Delete all Bank and Cash accounts
router.post('/deleteAllBankCashAccounts', checkPermission(permission), accountController.deleteAllBankCashAccounts);

// Batch delete multiple accounts by IDs
router.post('/batchDeleteAccounts', checkPermission(permission), accountController.batchDeleteAccounts);

module.exports = router;