const express = require('express');
const router = express.Router();
const salesOrderController = require('../controller/sales_order_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

// Define a permission name for this module
const permission = 'sales_orders';

// All routes use POST method
router.post('/', checkPermission(permission), salesOrderController.createOrder);
router.post('/getAllSalesOrder', checkPermission(permission), salesOrderController.getAllOrders);
router.post('/updateSalesOrder', checkPermission(permission), salesOrderController.updateOrder);
router.post('/deleteSalesOrder', checkPermission(permission), salesOrderController.deleteOrder);
router.post('/batchUpdateSalesOrder', checkPermission(permission), salesOrderController.batchUpdateOrders);
router.post('/batchDeleteSalesOrder', checkPermission(permission), salesOrderController.batchDeleteOrders);
router.post('/searchSalesOrderByUserName', checkPermission(permission), salesOrderController.searchOrdersByUserName);

router.post('/getValidCodeUserList', checkPermission(permission), salesOrderController.getValidCodeUserList);
router.post('/getValidCodeUserListForSalesInvoices', checkPermission(permission), salesOrderController.getValidCodeUserListForSalesInvoices);
router.post('/getInventoryByCodeUser', checkPermission(permission), salesOrderController.getInventoryByCodeUser);
router.post(
    '/getValidCodeUserListForSuppliers',
    checkPermission(permission),
    salesOrderController.getValidCodeUserListForSuppliers
);
router.post('/getSuppliersCodeName', salesOrderController.getSuppliersCodeAndName);

router.post('/getStockByItemCode', checkPermission(permission), salesOrderController.getStockByItemCode);


module.exports = router;