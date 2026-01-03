const express = require('express');
const router = express.Router();
const backupController = require('../controller/backup_controller');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: path.join(__dirname, '..', 'backups'),
  limits: { fileSize: 50 * 1024 * 1024 }
});
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

// use upload.single('file') here
router.post('/import', upload.single('file'), backupController.importBackup);


module.exports = router;
