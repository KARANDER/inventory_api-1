const JournalEntryModel = require('../model/journal_entry_model');
const JournalEntryTypeModel = require('../model/journal_entry_type_model');
const { logUserActivity } = require('../utils/activityLogger');
const SalesLock = require('../model/sales_lock_model');

const journalEntryController = {
  // Create new journal entry
  create: async (req, res) => {
    try {
      // Check if journal entries module is locked
      const isLocked = await SalesLock.isLocked('journal_entries');
      if (isLocked) {
        return res.status(403).json({
          success: false,
          message: 'Journal Entries are currently locked. Cannot create journal entries.'
        });
      }

      const { entry_type_id, date, type, customer_name, method_id, amount, notes, note_1, note_2, note_3, note_4 } = req.body;
      const user_id = req.user?.id;

      // Handle file upload
      const attachment = req.file ? req.file.path : null;

      // Validation
      if (!entry_type_id) {
        return res.status(400).json({ success: false, message: 'Journal entry type is required' });
      }

      // Check if user has access to this entry type
      const hasAccess = await JournalEntryTypeModel.checkUserAccess(user_id, entry_type_id);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'You do not have access to this journal entry type' });
      }

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
        entry_type_id: parseInt(entry_type_id),
        date,
        type,
        customer_name: customer_name.trim(),
        method_id: parseInt(method_id),
        amount: parseFloat(amount),
        notes: notes || null,
        note_1: note_1 || null,
        note_2: note_2 || null,
        note_3: note_3 || null,
        note_4: note_4 || null,
        attachment: attachment,
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
      const { entry_type_id, search, type, startDate, endDate, limit } = req.body;
      const user_id = req.user?.id;

      // Validation - entry_type_id is required
      if (!entry_type_id) {
        return res.status(400).json({ success: false, message: 'Journal entry type ID is required' });
      }

      // Check if user has access to this entry type
      const hasAccess = await JournalEntryTypeModel.checkUserAccess(user_id, entry_type_id);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'You do not have access to this journal entry type' });
      }

      const filters = { entry_type_id };
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
      const user_id = req.user?.id;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Journal entry ID is required' });
      }

      const entry = await JournalEntryModel.getById(id);

      if (!entry) {
        return res.status(404).json({ success: false, message: 'Journal entry not found' });
      }

      // Check if user has access to this entry's type
      const hasAccess = await JournalEntryTypeModel.checkUserAccess(user_id, entry.entry_type_id);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'You do not have access to this journal entry' });
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
      const { id, entry_type_id, date, type, customer_name, method_id, amount, notes, note_1, note_2, note_3, note_4 } = req.body;
      const user_id = req.user?.id;

      // Handle file upload
      const attachment = req.file ? req.file.path : undefined;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Journal entry ID is required' });
      }

      // Get existing entry to check access
      const existingEntry = await JournalEntryModel.getById(id);
      if (!existingEntry) {
        return res.status(404).json({ success: false, message: 'Journal entry not found' });
      }

      // Check if user has access to the existing entry's type
      const hasAccess = await JournalEntryTypeModel.checkUserAccess(user_id, existingEntry.entry_type_id);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'You do not have access to this journal entry' });
      }

      // If changing entry type, check access to new type
      if (entry_type_id && entry_type_id !== existingEntry.entry_type_id) {
        const hasNewAccess = await JournalEntryTypeModel.checkUserAccess(user_id, entry_type_id);
        if (!hasNewAccess) {
          return res.status(403).json({ success: false, message: 'You do not have access to the new journal entry type' });
        }
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
      if (entry_type_id !== undefined) updateData.entry_type_id = parseInt(entry_type_id);
      if (date !== undefined) updateData.date = date;
      if (type !== undefined) updateData.type = type;
      if (customer_name !== undefined) updateData.customer_name = customer_name.trim();
      if (method_id !== undefined) updateData.method_id = parseInt(method_id);
      if (amount !== undefined) updateData.amount = parseFloat(amount);
      if (notes !== undefined) updateData.notes = notes || null;
      if (note_1 !== undefined) updateData.note_1 = note_1 || null;
      if (note_2 !== undefined) updateData.note_2 = note_2 || null;
      if (note_3 !== undefined) updateData.note_3 = note_3 || null;
      if (note_4 !== undefined) updateData.note_4 = note_4 || null;
      if (attachment !== undefined) updateData.attachment = attachment;

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
      const user_id = req.user?.id;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Journal entry ID is required' });
      }

      // Get existing entry to check access
      const existingEntry = await JournalEntryModel.getById(id);
      if (!existingEntry) {
        return res.status(404).json({ success: false, message: 'Journal entry not found' });
      }

      // Check if user has access to this entry's type
      const hasAccess = await JournalEntryTypeModel.checkUserAccess(user_id, existingEntry.entry_type_id);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'You do not have access to this journal entry' });
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
      const { entry_type_id, search, startDate, endDate } = req.body;
      const user_id = req.user?.id;

      // Validation - entry_type_id is required
      if (!entry_type_id) {
        return res.status(400).json({ success: false, message: 'Journal entry type ID is required' });
      }

      // Check if user has access to this entry type
      const hasAccess = await JournalEntryTypeModel.checkUserAccess(user_id, entry_type_id);
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'You do not have access to this journal entry type' });
      }

      const filters = { entry_type_id };
      if (search) filters.search = search;
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


