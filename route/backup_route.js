const express = require('express');
const router = express.Router();
const backupController = require('../controller/backup_controller');
const authMiddleware = require('../middlewares/auth');

// Apply authentication middleware
router.use(authMiddleware);

// Create and download new backup
router.post('/download', backupController.downloadBackup);

// List all backups
router.post('/list', backupController.listBackups);

// Download specific backup
router.post('/downloadFile', backupController.downloadSpecificBackup);

// Delete backup
router.post('/delete', backupController.deleteBackup);

module.exports = router;
