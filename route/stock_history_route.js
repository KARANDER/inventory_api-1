const express = require('express');
const router = express.Router();
const stockHistoryController = require('../controller/stock_history_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

const permission = 'inventory_items';

router.post('/getItemStockHistory', checkPermission(permission), stockHistoryController.getItemStockHistory);
router.post('/getAllStockHistory', checkPermission(permission), stockHistoryController.getAllStockHistory);
router.post('/getItemStockSummary', checkPermission(permission), stockHistoryController.getItemStockSummary);

module.exports = router;

