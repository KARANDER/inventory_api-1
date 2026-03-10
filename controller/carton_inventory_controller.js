const CartonInventory = require('../model/carton_inventory_model');
const { logUserActivity } = require('../utils/activityLogger');

const cartonInventoryController = {
  /**
   * Handles the creation of a new carton.
   */
  addCarton: async (req, res) => {
    try {
      const created_by = req.user.id; // Get user ID from auth middleware
      const { carton_name, carton_quantity, ctn_wt } = req.body;

      // Basic validation
      if (!carton_name || carton_quantity === undefined) {
        return res.status(400).json({ success: false, message: 'Carton name and quantity are required.' });
      }

      const newCarton = await CartonInventory.create({ carton_name, carton_quantity, ctn_wt, created_by });
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
      const { id, carton_name, carton_quantity, ctn_wt } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Carton ID is required.' });
      }

      const affectedRows = await CartonInventory.update(id, { carton_name, carton_quantity, ctn_wt });
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

  batchUpdateCartons: async (req, res) => {
    try {
      const items = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Request body must be a non-empty array.' });
      }

      const failed = [];
      const success = [];

      for (const itemData of items) {
        const { id, carton_name, carton_quantity, ctn_wt } = itemData;
        if (!id) {
          failed.push({ id: null, message: 'Missing id in update object' });
          continue;
        }
        try {
          const oldRecord = await CartonInventory.findById(id);
          if (!oldRecord) {
            failed.push({ id, message: 'Carton not found' });
            continue;
          }
          const affected = await CartonInventory.update(id, { carton_name, carton_quantity, ctn_wt });
          if (affected === 0) {
            failed.push({ id, message: 'Carton not found' });
          } else {
            success.push({ id });
            await logUserActivity(req, {
              model_name: 'carton_inventory',
              action_type: 'UPDATE',
              record_id: id,
              description: `Updated carton (batch) ${carton_name || ''}`
            });
          }
        } catch (error) {
          failed.push({ id, message: error.message });
        }
      }

      res.status(200).json({ success: true, updated: success.length, failed });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  batchDeleteCartons: async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Request body must contain ids array.' });
      }

      let deletedCount = 0;
      const failed = [];

      for (const id of ids) {
        try {
          const affected = await CartonInventory.delete(id);
          if (affected > 0) {
            deletedCount++;
            await logUserActivity(req, {
              model_name: 'carton_inventory',
              action_type: 'DELETE',
              record_id: id,
              description: 'Deleted carton (batch)'
            });
          } else {
            failed.push({ id, message: 'Carton not found' });
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

module.exports = cartonInventoryController;