const Invoice = require('../model/new_sales_invoice_model');

const invoiceController = {
  createInvoice: async (req, res) => {
    // Unchanged
    try {
      console.log('--- Full Request Body Received in Controller ---');
      console.log(JSON.stringify(req.body, null, 2));
      const newInvoice = await Invoice.create(req.body);
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
      
      // Pass the entire request body to the model's update function.
      // The model is now smart enough to handle the complex data structure.
      const result = await Invoice.update(id, req.body);

      if (result.success) {
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
      res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  
  getInvoiceSummary: async (req, res) => {
    // Unchanged
    try {
      const summary = await Invoice.getInvoiceSummary();
      res.status(200).json({ success: true, data: summary });
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
};

module.exports = invoiceController;