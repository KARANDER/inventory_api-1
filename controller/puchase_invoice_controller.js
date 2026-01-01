const PurchaseInvoice = require('../model/purchase_invoice_model');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges');

// Helper function to process invoice items with new calculation logic
const processInvoiceItems = (items = []) => {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return items.map(item => {
    // Ensure input values are treated as numbers
    const no_of_peti = parseFloat(item.no_of_peti) || 0;
    const ret_peti_no = parseFloat(item.ret_peti_no) || 0;

    // 1. Calculate the balance
    const peti_balance = no_of_peti - ret_peti_no;

    // 2. Determine the status based on the balance
    const pati_status = peti_balance === 0 ? 0 : 1;

    // 3. Return a new item object with the calculated fields
    return {
      ...item, // This correctly copies ret_peti_no and peti_Type from the request
      peti_balance: peti_balance,
      pati_status: pati_status,
      // --- FIX: The lines below were duplicating keys already copied by ...item ---
      // ret_peti_no: ret_peti_no, // REMOVED
      // Peti_Type: item.Peti_Type || null // REMOVED
    };
  });
};


const purchaseInvoiceController = {
  addInvoiceWithItems: async (req, res) => {
    try {
      const { line_items, user_code, total_amount, ...invoiceData } = req.body;

      const processedItems = processInvoiceItems(line_items);

      const newInvoice = await PurchaseInvoice.createWithStockUpdate(
        invoiceData,
        processedItems,
        user_code,
        total_amount
      );
      await logUserActivity(req, {
        model_name: 'purchase_invoices',
        action_type: 'CREATE',
        record_id: newInvoice.id,
        description: `Created purchase invoice ${invoiceData.invoice_number || ''}`
      });
      res.status(201).json({ success: true, message: "Invoice created successfully.", data: newInvoice });
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllInvoicesWithItems: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.body;

      const result = await PurchaseInvoice.findAllPaginated({
        page: parseInt(page),
        limit: parseInt(limit),
        search: search || ''
      });

      const invoicesWithDetails = await Promise.all(result.data.map(async (invoice) => {
        const items = await PurchaseInvoice.findItemsByInvoiceId(invoice.id);
        return { ...invoice, items };
      }));

      res.status(200).json({
        success: true,
        data: invoicesWithDetails,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting all invoices:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  updateInvoice: async (req, res) => {
    try {
      // Destructure the new deleted_item_ids array from the request body
      const { id, line_items, deleted_item_ids, ...invoiceData } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Invoice ID is required for update.' });
      }

      // Fetch old record before updating
      const oldRecord = await PurchaseInvoice.findById(id);
      if (!oldRecord) {
        return res.status(404).json({ success: false, message: 'Purchase invoice not found' });
      }

      // Process items to add calculated fields before sending to the model
      const processedItems = processInvoiceItems(line_items);

      const updatedInvoice = await PurchaseInvoice.updateWithItems(
        id,
        invoiceData,
        processedItems,
        deleted_item_ids // Pass the new array to the model
      );

      // Compare old vs new values and log changes (excluding line_items)
      const changes = compareChanges(oldRecord, invoiceData);
      await logUserActivity(req, {
        model_name: 'purchase_invoices',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated purchase invoice',
        changes: changes
      });

      res.status(200).json({ success: true, message: 'Invoice updated successfully', data: updatedInvoice });
    } catch (error) {
      console.error('Update Invoice Error:', error);
      res.status(500).json({ success: false, message: 'Failed to update invoice', error: error.message });
    }
  },

  deleteInvoice: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Invoice ID is required.' });
      }
      await PurchaseInvoice.deleteInvoice(id);
      await logUserActivity(req, {
        model_name: 'purchase_invoices',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted purchase invoice'
      });
      res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      res.status(500).json({ success: false, message: 'Failed to delete invoice', error: error.message });
    }
  },

  getInventoryDetailsByCodeUser: async (req, res) => {
    try {
      const { code_user } = req.body;
      if (!code_user) {
        return res.status(400).json({ success: false, message: 'Item code is required.' });
      }
      const details = await PurchaseInvoice.getDetailsByCodeUser(code_user);
      if (details) {
        res.status(200).json({ success: true, data: details });
      } else {
        res.status(404).json({ success: false, message: 'Item not found.' });
      }
    } catch (error) {
      console.error('Error getting inventory details:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getInvoiceSummaries: async (req, res) => {
    try {
      const summaries = await PurchaseInvoice.findAllWithTotalAmount();
      res.status(200).json({ success: true, data: summaries });
    } catch (error) {
      console.error('Error fetching invoice summaries:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getUserCode: async (req, res) => {
    try {
      const { user } = req.body;

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'User parameter is required'
        });
      }

      const codeUsers = await PurchaseInvoice.findCodeUserByUser(user);

      if (codeUsers.length > 0) {
        res.status(200).json({
          success: true,
          data: codeUsers  // Just the array of code_user values
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found in inventory items'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  // Batch delete multiple purchase invoices
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
          await PurchaseInvoice.deleteInvoice(id);
          deletedCount++;
          await logUserActivity(req, {
            model_name: 'purchase_invoices',
            action_type: 'DELETE',
            record_id: id,
            description: 'Deleted purchase invoice (batch)'
          });
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

module.exports = purchaseInvoiceController;