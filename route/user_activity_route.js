const express = require('express');
const router = express.Router();
const userActivityController = require('../controller/user_activity_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

// Use 'accounts' permission for admin-like access to activity log
const permission = 'accounts';

router.post('/getHistory', checkPermission(permission), userActivityController.getHistory);

module.exports = router;

