const PaymentMethodModel = require('../model/payment_method_model');
const { logUserActivity } = require('../utils/activityLogger');

const paymentMethodController = {
  // Get all payment methods
  getAll: async (req, res) => {
    try {
      const methods = await PaymentMethodModel.getAll();
      res.status(200).json({ success: true, data: methods });
    } catch (error) {
      console.error('Error in getAll payment methods:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Create new payment method
  create: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Payment method name is required' });
      }

      const newMethod = await PaymentMethodModel.create(name.trim());
      
      await logUserActivity(req, {
        model_name: 'payment_methods',
        action_type: 'CREATE',
        record_id: newMethod.id,
        description: `Created payment method: ${name}`
      });

      res.status(201).json({ success: true, message: 'Payment method created successfully', data: newMethod });
    } catch (error) {
      console.error('Error in create payment method:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Payment method with this name already exists' });
      }
      
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Update payment method
  update: async (req, res) => {
    try {
      const { id, name } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Payment method ID is required' });
      }

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Payment method name is required' });
      }

      const updatedMethod = await PaymentMethodModel.update(id, name.trim());

      if (!updatedMethod) {
        return res.status(404).json({ success: false, message: 'Payment method not found' });
      }

      await logUserActivity(req, {
        model_name: 'payment_methods',
        action_type: 'UPDATE',
        record_id: id,
        description: `Updated payment method: ${name}`
      });

      res.status(200).json({ success: true, message: 'Payment method updated successfully', data: updatedMethod });
    } catch (error) {
      console.error('Error in update payment method:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Payment method with this name already exists' });
      }
      
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Delete payment method
  delete: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Payment method ID is required' });
      }

      const deleted = await PaymentMethodModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Payment method not found' });
      }

      await logUserActivity(req, {
        model_name: 'payment_methods',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted payment method'
      });

      res.status(200).json({ success: true, message: 'Payment method deleted successfully' });
    } catch (error) {
      console.error('Error in delete payment method:', error);
      
      if (error.message.includes('Cannot delete')) {
        return res.status(400).json({ success: false, message: error.message });
      }
      
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  }
};

module.exports = paymentMethodController;


