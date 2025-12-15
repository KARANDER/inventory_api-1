const JournalCustomerModel = require('../model/journal_customer_model');
const { logUserActivity } = require('../utils/activityLogger');

const journalCustomerController = {
  // Get all customers (for dropdown)
  getAll: async (req, res) => {
    try {
      const customers = await JournalCustomerModel.getAll();

      // For dropdown we only really need id + name, but return full objects for flexibility
      res.status(200).json({
        success: true,
        data: customers,
      });
    } catch (error) {
      console.error('Error in getAll journal customers:', error);
      res
        .status(500)
        .json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Create new customer
  create: async (req, res) => {
    try {
      const { name, notes } = req.body;

      if (!name || !name.trim()) {
        return res
          .status(400)
          .json({ success: false, message: 'Customer name is required' });
      }

      const newCustomer = await JournalCustomerModel.create({
        name: name.trim(),
        notes: notes || null,
      });

      await logUserActivity(req, {
        model_name: 'journal_customers',
        action_type: 'CREATE',
        record_id: newCustomer.id,
        description: `Created journal customer: ${newCustomer.name}`,
      });

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: newCustomer,
      });
    } catch (error) {
      console.error('Error in create journal customer:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: 'Customer with this name already exists',
        });
      }

      res
        .status(500)
        .json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Update customer
  update: async (req, res) => {
    try {
      const { id, name, notes } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: 'Customer ID is required' });
      }

      if (name !== undefined && !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Customer name cannot be empty',
        });
      }

      const updatedCustomer = await JournalCustomerModel.update(id, {
        name: name !== undefined ? name.trim() : undefined,
        notes,
      });

      if (!updatedCustomer) {
        return res
          .status(404)
          .json({ success: false, message: 'Customer not found' });
      }

      await logUserActivity(req, {
        model_name: 'journal_customers',
        action_type: 'UPDATE',
        record_id: id,
        description: `Updated journal customer: ${updatedCustomer.name}`,
      });

      res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: updatedCustomer,
      });
    } catch (error) {
      console.error('Error in update journal customer:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: 'Customer with this name already exists',
        });
      }

      res
        .status(500)
        .json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Delete customer
  delete: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: 'Customer ID is required' });
      }

      const deleted = await JournalCustomerModel.delete(id);

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: 'Customer not found' });
      }

      await logUserActivity(req, {
        model_name: 'journal_customers',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted journal customer',
      });

      res
        .status(200)
        .json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Error in delete journal customer:', error);

      if (error.message.includes('Cannot delete')) {
        return res
          .status(400)
          .json({ success: false, message: error.message });
      }

      res
        .status(500)
        .json({ success: false, message: 'Server Error', error: error.message });
    }
  },
};

module.exports = journalCustomerController;

