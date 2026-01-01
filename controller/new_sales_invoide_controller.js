const Invoice = require('../model/new_sales_invoice_model');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges');

const invoiceController = {
  createInvoice: async (req, res) => {
    // Unchanged
    try {
      console.log('--- Full Request Body Received in Controller ---');
      console.log(JSON.stringify(req.body, null, 2));
      const newInvoice = await Invoice.create(req.body);
      await logUserActivity(req, {
        model_name: 'invoices',
        action_type: 'CREATE',
        record_id: newInvoice.id,
        description: `Created invoice ${req.body.invoice_number || ''}`
      });
      res.status(201).json({ success: true, message: 'Invoice created successfully', data: newInvoice });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllInvoices: async (req, res) => {
    // Unchanged
    try {
      const invoices = await Invoice.findAll();
      res.status(200).json({ success: true, data: invoices });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // --- CHANGE: Modified to work with the new advanced model function ---
  updateInvoice: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Invoice ID is required in the body.' });
      }

      // Fetch old record before updating
      const oldRecord = await Invoice.findById(id);
      if (!oldRecord) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }

      // Pass the entire request body to the model's update function.
      // The model is now smart enough to handle the complex data structure.
      const result = await Invoice.update(id, req.body);

      if (result.success) {
        // Compare old vs new values (excluding items array for simplicity)
        const { items, deleted_item_ids, ...mainData } = req.body;
        const changes = compareChanges(oldRecord, mainData);

        await logUserActivity(req, {
          model_name: 'invoices',
          action_type: 'UPDATE',
          record_id: id,
          description: 'Updated invoice',
          changes: changes
        });
        res.status(200).json({ success: true, message: 'Invoice updated successfully' });
      } else {
        // This case might not be reached if errors are thrown, but it's good practice.
        res.status(404).json({ success: false, message: 'Invoice not found or update failed' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  deleteInvoice: async (req, res) => {
    // Unchanged
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Invoice ID is required in the body.' });
      }
      const affectedRows = await Invoice.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      await logUserActivity(req, {
        model_name: 'invoices',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted invoice'
      });
      res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getInvoiceSummary: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.body;

      const result = await Invoice.getInvoiceSummaryPaginated({
        page: parseInt(page),
        limit: parseInt(limit),
        search: search || ''
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  // Add this new function inside the invoiceController object

  getStatement: async (req, res) => {
    try {
      const { customer_id } = req.body; // Get customer_id from query params (e.g., /api/statement?customer_id=CUST-003)

      if (!customer_id) {
        return res.status(400).json({ success: false, message: 'Customer ID is required.' });
      }

      const statementData = await Invoice.getStatementByCustomerId(customer_id);
      res.status(200).json({ success: true, data: statementData });

    } catch (error) {
      if (error.message === 'Customer not found.') {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Batch delete multiple invoices
  batchDeleteInvoices: async (req, res) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Request body must contain ids array.' });
      }

      let deletedCount = 0;
      const failed = [];

      for (const id of ids) {
        try {
          const affected = await Invoice.delete(id);
          if (affected > 0) {
            deletedCount++;
            await logUserActivity(req, {
              model_name: 'invoices',
              action_type: 'DELETE',
              record_id: id,
              description: 'Deleted invoice (batch)'
            });
          } else {
            failed.push({ id, message: 'Invoice not found' });
          }
        } catch (error) {
          failed.push({ id, message: error.message });
        }
      }

      res.status(200).json({ success: true, deletedCount, failed });

    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
};

module.exports = invoiceController;