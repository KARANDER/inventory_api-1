const express = require('express');
const router = express.Router();
const receiptController = require('../controller/receipt_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');
const upload = require('../middlewares/upload');

router.post('/', [authMiddleware, checkPermission('receipts'), upload.single('image')], receiptController.createReceipt);
router.post('/getAllReceipt', [authMiddleware, checkPermission('receipts')], receiptController.getAllReceipts);
router.post('/updateReceipt', [authMiddleware, checkPermission('receipts'), upload.single('image')], receiptController.updateReceipt);

router.post('/deleteReceipt', [authMiddleware, checkPermission('receipts')], receiptController.deleteReceipt);

// Delete all receipts
router.post('/deleteAllReceipts', [authMiddleware, checkPermission('receipts')], receiptController.deleteAllReceipts);

// Batch delete multiple receipts by IDs
router.post('/batchDeleteReceipts', [authMiddleware, checkPermission('receipts')], receiptController.batchDeleteReceipts);

module.exports = router;