const express = require('express');
const router = express.Router();
const databaseController = require('../controller/database_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

// Master delete API - deletes all data from database
// WARNING: This is a destructive operation!
router.post('/deleteAllData', checkPermission('admin'), databaseController.deleteAllData);

module.exports = router;
