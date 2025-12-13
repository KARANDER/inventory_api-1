// const express = require('express');
// const router = express.Router();
// const purchaseInvoiceController = require('../controller/puchase_invoice_controller');
// const authMiddleware = require('../middlewares/auth');
// const checkPermission = require('../middlewares/checkPermission');
// const upload = require('../middlewares/upload');

// router.use(authMiddleware);

// const permission = 'purchase_invoices'; 

// // POST /purchase-invoices/create - Create a new purchase invoice with multiple images
// router.post('/create', [checkPermission(permission), upload.array('images', 10)], purchaseInvoiceController.createInvoice);

// // POST /purchase-invoices/getAll - Get a list of all purchase invoices
// router.post('/getAll', checkPermission(permission), purchaseInvoiceController.getAllInvoices);

// // POST /purchase-invoices/getById - Get a single purchase invoice by its ID from the body
// router.post('/getById', checkPermission(permission), purchaseInvoiceController.getInvoiceById);

// // POST /purchase-invoices/update - Update an existing purchase invoice
// router.post('/update', [checkPermission(permission), upload.array('images', 10)], purchaseInvoiceController.updateInvoice);

// // POST /purchase-invoices/delete - Delete a purchase invoice using an ID from the body
// router.post('/delete', checkPermission(permission), purchaseInvoiceController.deleteInvoice);

// // Your existing route for getting data from inventory
// router.post('/getDataFromInventoryItem', checkPermission(permission), purchaseInvoiceController.getInventoryDetailsByCodeUser);

// module.exports = router;
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');
const purchaseInvoiceController = require('../controller/puchase_invoice_controller');

// POST to add invoice with items
router.post('/', [authMiddleware, checkPermission('purchase_invoices')], purchaseInvoiceController.addInvoiceWithItems);

// POST to get invoice by id (id in body)
router.post('/getPurchaseInvoice', [authMiddleware, checkPermission('purchase_invoices')], purchaseInvoiceController.getAllInvoicesWithItems);

// POST to update invoice (id in body)
router.post('/updatePurchaseInvoice', [authMiddleware, checkPermission('purchase_invoices')], purchaseInvoiceController.updateInvoice);

// POST to delete invoice (id in body)
router.post('/deletePurchaseInvoice', [authMiddleware, checkPermission('purchase_invoices')], purchaseInvoiceController.deleteInvoice);
// POST to batch delete multiple invoices (ids array in body)
router.post('/batchDeletePurchaseInvoices', [authMiddleware, checkPermission('purchase_invoices')], purchaseInvoiceController.batchDeleteInvoices);
router.post('/getDataFromInventoryItem', [authMiddleware, checkPermission('purchase_invoices')], purchaseInvoiceController.getInventoryDetailsByCodeUser);
router.post('/getSummaries', [authMiddleware, checkPermission('purchase_invoices')], purchaseInvoiceController.getInvoiceSummaries);
router.post('/getUserCode', [authMiddleware, checkPermission('purchase_invoices')], purchaseInvoiceController.getUserCode);

module.exports = router;