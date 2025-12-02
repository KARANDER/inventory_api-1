const OrderStock = require('../model/order_stock_model');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges');

const orderStockController = {
  addOrderStock: async (req, res) => {
    try {
      const { order_stock } = req.body;
      const newOrderStock = await OrderStock.create(order_stock);
      await logUserActivity(req, {
        model_name: 'order_stock',
        action_type: 'CREATE',
        record_id: newOrderStock.id,
        description: 'Created order stock'
      });
      res.status(201).json({ success: true, data: newOrderStock });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getOrderStock: async (req, res) => {
    try {
      const stocks = await OrderStock.getAll();
      res.status(200).json({ success: true, data: stocks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateOrderStock: async (req, res) => {
    try {
      const { id, order_stock } = req.body;
      
      // Fetch old record before updating
      const oldRecord = await OrderStock.findById(id);
      if (!oldRecord) {
        return res.status(404).json({ success: false, message: 'OrderStock not found' });
      }
      
      const affectedRows = await OrderStock.update(id, order_stock);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'OrderStock not found' });
      }
      
      // Compare old vs new values and log changes
      const changes = compareChanges(oldRecord, { order_stock });
      await logUserActivity(req, {
        model_name: 'order_stock',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated order stock',
        changes: changes
      });
      res.status(200).json({ success: true, message: 'OrderStock updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteOrderStock: async (req, res) => {
    try {
      const { id } = req.body;
      const affectedRows = await OrderStock.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'OrderStock not found' });
      }
      await logUserActivity(req, {
        model_name: 'order_stock',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted order stock'
      });
      res.status(200).json({ success: true, message: 'OrderStock deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = orderStockController;
