const express = require('express');
const router = express.Router();
const invoiceController = require('../controller/new_sales_invoide_controller');
const authMiddleware = require('../middlewares/auth'); // Optional: Add if you have auth
const checkPermission = require('../middlewares/checkPermission'); // Optional

// To use authentication and permissions like your example:
// router.use(authMiddleware);
// const permission = 'invoices';

// All routes use the POST method as requested
router.post('/', [authMiddleware, checkPermission('sales_invoices')],  invoiceController.createInvoice);
router.post('/getAllInvoices',  [authMiddleware, checkPermission('sales_invoices')],  invoiceController.getAllInvoices);
router.post('/updateInvoice',  [authMiddleware, checkPermission('sales_invoices')],  invoiceController.updateInvoice);
router.post('/deleteInvoice',  [authMiddleware, checkPermission('sales_invoices')],  invoiceController.deleteInvoice);
// router.post('/getInvoiceList',[authMiddleware, checkPermission('sales_invoices')], invoiceController.getInvoiceList);
router.post(
  '/getInvoiceSummary',
  [authMiddleware, checkPermission('sales_invoices')],
  invoiceController.getInvoiceSummary
);
router.post('/statement', invoiceController.getStatement);

module.exports = router;
