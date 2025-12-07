const JournalEntryModel = require('../model/journal_entry_model');
const { logUserActivity } = require('../utils/activityLogger');

const journalEntryController = {
  // Create new journal entry
  create: async (req, res) => {
    try {
      const { date, type, customer_name, method_id, amount, notes } = req.body;
      const user_id = req.user?.id;

      // Validation
      if (!date) {
        return res.status(400).json({ success: false, message: 'Date is required' });
      }
      if (!type || !['Payment', 'Receipt'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Type must be either "Payment" or "Receipt"' });
      }
      if (!customer_name || !customer_name.trim()) {
        return res.status(400).json({ success: false, message: 'Customer name is required' });
      }
      if (!method_id) {
        return res.status(400).json({ success: false, message: 'Payment method is required' });
      }
      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
      }

      const entryData = {
        date,
        type,
        customer_name: customer_name.trim(),
        method_id: parseInt(method_id),
        amount: parseFloat(amount),
        notes: notes || null,
        user_id
      };

      const newEntry = await JournalEntryModel.create(entryData);

      await logUserActivity(req, {
        model_name: 'journal_entries',
        action_type: 'CREATE',
        record_id: newEntry.id,
        description: `Created ${type} entry for ${customer_name}: ₹${amount}`
      });

      res.status(201).json({ success: true, message: 'Journal entry created successfully', data: newEntry });
    } catch (error) {
      console.error('Error in create journal entry:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Get all journal entries
  getAll: async (req, res) => {
    try {
      const { search, type, startDate, endDate, limit } = req.body;

      const filters = {};
      if (search) filters.search = search;
      if (type) filters.type = type;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (limit) filters.limit = parseInt(limit);

      const entries = await JournalEntryModel.getAll(filters);
      res.status(200).json({ success: true, data: entries });
    } catch (error) {
      console.error('Error in getAll journal entries:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Get journal entry by ID
  getById: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Journal entry ID is required' });
      }

      const entry = await JournalEntryModel.getById(id);

      if (!entry) {
        return res.status(404).json({ success: false, message: 'Journal entry not found' });
      }

      res.status(200).json({ success: true, data: entry });
    } catch (error) {
      console.error('Error in getById journal entry:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Update journal entry
  update: async (req, res) => {
    try {
      const { id, date, type, customer_name, method_id, amount, notes } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Journal entry ID is required' });
      }

      // Validation for type if provided
      if (type && !['Payment', 'Receipt'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Type must be either "Payment" or "Receipt"' });
      }

      // Validation for amount if provided
      if (amount !== undefined && amount <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
      }

      const updateData = {};
      if (date !== undefined) updateData.date = date;
      if (type !== undefined) updateData.type = type;
      if (customer_name !== undefined) updateData.customer_name = customer_name.trim();
      if (method_id !== undefined) updateData.method_id = parseInt(method_id);
      if (amount !== undefined) updateData.amount = parseFloat(amount);
      if (notes !== undefined) updateData.notes = notes || null;

      const updatedEntry = await JournalEntryModel.update(id, updateData);

      if (!updatedEntry) {
        return res.status(404).json({ success: false, message: 'Journal entry not found' });
      }

      await logUserActivity(req, {
        model_name: 'journal_entries',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated journal entry'
      });

      res.status(200).json({ success: true, message: 'Journal entry updated successfully', data: updatedEntry });
    } catch (error) {
      console.error('Error in update journal entry:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Delete journal entry
  delete: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Journal entry ID is required' });
      }

      const deleted = await JournalEntryModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Journal entry not found' });
      }

      await logUserActivity(req, {
        model_name: 'journal_entries',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted journal entry'
      });

      res.status(200).json({ success: true, message: 'Journal entry deleted successfully' });
    } catch (error) {
      console.error('Error in delete journal entry:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Get metrics (Total Receipts, Total Payments, Remaining Balance)
  getMetrics: async (req, res) => {
    try {
      const { startDate, endDate } = req.body;

      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const metrics = await JournalEntryModel.getMetrics(filters);

      res.status(200).json({ 
        success: true, 
        data: {
          total_receipts: metrics.total_receipts,
          total_payments: metrics.total_payments,
          remaining_balance: metrics.remaining_balance
        }
      });
    } catch (error) {
      console.error('Error in getMetrics:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  }
};

module.exports = journalEntryController;


