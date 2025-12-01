const SalesInvoice = require('../model/sales_invoice_model');
const db = require('../config/db');

const salesInvoiceController = {
  createInvoice: async (req, res) => {
    try {
      const data = req.body;

      // Validate required fields (adjust as per your schema)
      if (
        !data.customer ||
        !data.invoice_no ||
        !data.invoice_date ||
        !data.due_date ||
        !data.status ||
        data.no1 == null ||
        data.no2 == null
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Required fields missing: customer, invoice_no, invoice_date, due_date, status, no1, no2',
        });
      }

      // 1. Existing sales invoice creation
      const newInvoice = await SalesInvoice.create(data);

      // 2. After successful creation, update master_items stock quantity (PCS) and stock_kg (KG)

      // Assuming invoice includes item_code, total_pcs (PCS) and net_kg (KG)
      const item_code = data.item_code;
      const total_pcs = data.total_pcs; // total pieces to subtract
      const net_kg = parseFloat(data.net_kg) || 0; // total KG to subtract

      // Fetch current stock quantities from master_items for the item_code
      const [masterRows] = await db.query(
        'SELECT stock_quantity, COALESCE(stock_kg, 0) AS stock_kg FROM master_items WHERE item_code = ? LIMIT 1',
        [item_code]
      );

      if (masterRows.length > 0) {
        const currentStockPcs = masterRows[0].stock_quantity;
        const currentStockKg = masterRows[0].stock_kg || 0;

        const updatedStockPcs = currentStockPcs - total_pcs;
        const updatedStockKg = currentStockKg - net_kg;

        // Update stock_quantity (PCS) and stock_kg (KG) in master_items
        await db.query(
          'UPDATE master_items SET stock_quantity = ?, stock_kg = ? WHERE item_code = ?',
          [updatedStockPcs, updatedStockKg, item_code]
        );
      }

      // 3. Return success response
      return res.status(201).json({
        success: true,
        message: 'Sales invoice created and master stock updated successfully.',
        data: newInvoice,
      });
    } catch (error) {
      console.error('Create Invoice Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  },

  getAllInvoices: async (req, res) => {
    try {
      const invoices = await SalesInvoice.findAll();

      const today = new Date();
      const data = invoices.map(inv => {
        const dueDate = new Date(inv.due_date);
        let daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        daysOverdue = daysOverdue > 0 ? daysOverdue : 0;

        return {
          ...inv,
          days_overdue: daysOverdue,
          total_no: (inv.no1 || 0) + (inv.no2 || 0)
        };
      });

      res.status(200).json({ success: true, data });

    } catch (error) {
      console.error('Get All Invoices Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  updateInvoice: async (req, res) => {
    try {
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invoice ID is required for update.' 
        });
      }

      const updated = await SalesInvoice.update(id, updateData);

      res.status(200).json({ 
        success: true, 
        message: 'Sales invoice updated successfully.', 
        data: updated 
      });

    } catch (error) {
      console.error('Update Invoice Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  deleteInvoice: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invoice ID is required to delete.' 
        });
      }

      await SalesInvoice.delete(id);

      res.status(200).json({ 
        success: true, 
        message: 'Sales invoice deleted successfully.' 
      });

    } catch (error) {
      console.error('Delete Invoice Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },
  getDistinctCustomerNames: async (req, res) => {
  try {
    const names = await SalesInvoice.getDistinctCustomerNames();
    res.status(200).json({ success: true, data: names, count: names.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
},
findFinishNoteByCustomerName: async (req, res) => {
  try {
    const { customer_name } = req.body;
    if (!customer_name) {
      return res.status(400).json({ success: false, message: 'customer_name is required' });
    }
    const results = await SalesInvoice.findFinishNoteByCustomerName(customer_name);
    res.status(200).json({ success: true, data: results, count: results.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
},

getUnfinishedFinishesForCustomer: async (req, res) => {
  try {
    // Input is 'code_user' which maps to customer_id
    const { code_user } = req.body;

    if (!code_user) {
      return res.status(400).json({ 
        success: false, 
        message: 'code_user is required in the request body.' 
      });
    }

    const unfinishedFinishes = await SalesInvoice.findUnfinishedFinishesByCustomerId(code_user);

    res.status(200).json({ success: true, data: unfinishedFinishes });

  } catch (error) {
    console.error('Error in getUnfinishedFinishesForCustomer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
},
findInvoiceByNumber: async (req, res) => {
    try {
      const { invoice_no } = req.body;

      if (!invoice_no) {
        return res.status(400).json({ 
          success: false, 
          message: 'invoice_no is required in the request body.' 
        });
      }

      const invoices = await SalesInvoice.findByInvoiceNo(invoice_no);

      res.status(200).json({ 
        success: true, 
        data: invoices, 
        count: invoices.length 
      });

    } catch (error) {
      console.error('Error in findInvoiceByNumber:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error: error.message 
      });
    }
  },

  getInvoiceSummary: async (req, res) => {
    try {
      const invoices = await SalesInvoice.findAll();

      const today = new Date();
      const data = invoices.map(inv => {
        const dueDate = new Date(inv.due_date);
        let daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        daysOverdue = daysOverdue > 0 ? daysOverdue : 0;

        // **MODIFICATION HERE**
        // Instead of returning all fields with "...inv", we now specify exactly which fields to return.
        return {
          customer: inv.customer,
          invoice_no: inv.invoice_no,
          days_overdue: daysOverdue,
          status: inv.status,
          no1: inv.no1,
          no2: inv.no2,
          total_no: (inv.no1 || 0) + (inv.no2 || 0)
        };
      });

      res.status(200).json({ success: true, data });

    } catch (error) {
      console.error('Get Invoice Summary Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: error.message 
      });
    }
  },
  createBatchInvoices: async (req, res) => {
    // LOG 1
    console.log('--- CONTROLLER: Batch create process STARTED. ---');
    try {
      const invoices = req.body;

      if (!Array.isArray(invoices) || invoices.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Request body must be a non-empty array of invoices.',
        });
      }

      // LOG 2
      console.log(`--- CONTROLLER: Calling model to create ${invoices.length} invoices. ---`);
      const newInvoices = await SalesInvoice.createBatch(invoices);

      return res.status(201).json({
        success: true,
        message: `Successfully created ${newInvoices.length} invoices in a batch.`,
        data: newInvoices,
      });

    } catch (error) {
      // LOG 3 (if an error is caught)
      console.error('--- CONTROLLER: CAUGHT AN ERROR ---', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during batch creation.',
        error: error.message,
      });
    }
  },
};

module.exports = salesInvoiceController;
