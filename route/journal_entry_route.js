const express = require('express');
const router = express.Router();
const journalEntryController = require('../controller/journal_entry_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');
const upload = require('../middlewares/upload');

// All routes require authentication
router.use(authMiddleware);

// Define permission for journal entries
const permission = 'journal_entries';

// Get all journal entries
router.post('/getAll', checkPermission(permission), journalEntryController.getAll);

// Get journal entry by ID
router.post('/getById', checkPermission(permission), journalEntryController.getById);

// Create new journal entry (with file upload)
router.post('/', checkPermission(permission), upload.single('attachment'), journalEntryController.create);

// Update journal entry (with file upload)
router.post('/update', checkPermission(permission), upload.single('attachment'), journalEntryController.update);

// Delete journal entry
router.post('/delete', checkPermission(permission), journalEntryController.delete);

// Get metrics (Total Receipts, Total Payments, Remaining Balance)
router.post('/getMetrics', checkPermission(permission), journalEntryController.getMetrics);

module.exports = router;
