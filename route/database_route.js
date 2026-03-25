const express = require('express');
const router = express.Router();
const databaseController = require('../controller/database_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

// Master delete API - deletes all data from database
// WARNING: This is a destructive operation!
// Allowed for: 'admin' or 'create_user' permissions
router.post('/deleteAllData', checkPermission(['admin', 'create_user']), databaseController.deleteAllData);

module.exports = router;
