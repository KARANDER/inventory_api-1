const express = require('express');
const router = express.Router();
const masterController = require('../controller/master_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

const permission = 'master_items';

// All routes use POST method, and none have ':id' in the URL
router.post('/', checkPermission(permission), masterController.createItem);
router.post('/getAllMaster', checkPermission(permission), masterController.getAllItems);
router.post('/updateMaster', checkPermission(permission), masterController.updateItem);
router.post('/deleteMaster', checkPermission(permission), masterController.deleteItem);
router.post('/getItemCodes', checkPermission(permission), masterController.getItemCodes);
router.post('/batchUpdate', checkPermission(permission), masterController.batchUpdateItems);
router.post('/batchDelete', checkPermission(permission), masterController.batchDeleteItems);
router.post('/createInventoryFromMaster', checkPermission(permission), masterController.createInventoryFromMaster);


module.exports = router;