const express = require('express');
const router = express.Router();
const journalEntryTypeController = require('../controller/journal_entry_type_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

// All routes require authentication
router.use(authMiddleware);

// Define permission for journal entries
const permission = 'journal_entries';

// Get my accessible journal entry types
router.post('/getMyTypes', checkPermission(permission), journalEntryTypeController.getMyTypes);

// Get all journal entry types (admin)
router.post('/getAll', checkPermission(permission), journalEntryTypeController.getAll);

// Get journal entry type by ID
router.post('/getById', checkPermission(permission), journalEntryTypeController.getById);

// Create new journal entry type
router.post('/', checkPermission(permission), journalEntryTypeController.create);

// Update journal entry type
router.post('/update', checkPermission(permission), journalEntryTypeController.update);

// Add users to journal entry type
router.post('/addUsers', checkPermission(permission), journalEntryTypeController.addUsers);

// Remove users from journal entry type
router.post('/removeUsers', checkPermission(permission), journalEntryTypeController.removeUsers);

// Delete journal entry type
router.post('/delete', checkPermission(permission), journalEntryTypeController.delete);

module.exports = router;
