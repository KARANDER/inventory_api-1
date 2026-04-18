const express = require('express');
const router = express.Router();
const userController = require('../controller/user_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

// Public routes
router.post('/login', userController.login);

// Protected routes (require authentication)
router.use(authMiddleware);

// Register/Create new user (requires journal_entries permission)
router.post('/register', checkPermission('journal_entries'), userController.register);

// Get all users (for dropdown/selection)
router.post('/getAll', checkPermission('journal_entries'), userController.getAll);

// Get user by ID
router.post('/getById', checkPermission('journal_entries'), userController.getById);

// Update user
router.post('/update', checkPermission('journal_entries'), userController.update);

// Delete user
router.post('/delete', checkPermission('journal_entries'), userController.delete);

module.exports = router;