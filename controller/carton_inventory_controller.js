const CartonInventory = require('../model/carton_inventory_model');
const { logUserActivity } = require('../utils/activityLogger');

const cartonInventoryController = {
  /**
   * Handles the creation of a new carton.
   */
  addCarton: async (req, res) => {
    try {
      const created_by = req.user.id; // Get user ID from auth middleware
      const { carton_name, carton_quantity } = req.body;

      // Basic validation
      if (!carton_name || carton_quantity === undefined) {
        return res.status(400).json({ success: false, message: 'Carton name and quantity are required.' });
      }

      const newCarton = await CartonInventory.create({ carton_name, carton_quantity, created_by });
      await logUserActivity(req, {
        model_name: 'carton_inventory',
        action_type: 'CREATE',
        record_id: newCarton.id,
        description: `Created carton ${carton_name}`
      });
      res.status(201).json({ success: true, message: 'Carton added successfully!', data: newCarton });

    } catch (error) {
      // Handle unique constraint violation for 'carton_name'
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'A carton with this name already exists.' });
      }
      // Handle other server errors
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getCartonNames: async (req, res) => {
    try {
      const cartonNames = await CartonInventory.findAllCartonNames();
      res.status(200).json({
        success: true,
        data: cartonNames
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  updateCarton: async (req, res) => {
    try {
      const { id, carton_name, carton_quantity } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Carton ID is required.' });
      }

      const affectedRows = await CartonInventory.update(id, { carton_name, carton_quantity });
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Carton not found.' });
      }

      await logUserActivity(req, {
        model_name: 'carton_inventory',
        action_type: 'UPDATE',
        record_id: id,
        description: `Updated carton ${carton_name}`
      });
      res.status(200).json({ success: true, message: 'Carton updated successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  deleteCarton: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Carton ID is required.' });
      }

      const affectedRows = await CartonInventory.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Carton not found.' });
      }

      await logUserActivity(req, {
        model_name: 'carton_inventory',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted carton'
      });
      res.status(200).json({ success: true, message: 'Carton deleted successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
};

module.exports = cartonInventoryController;