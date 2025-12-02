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


  // You can add getAllCartons, updateCarton, etc. functions here later
};

module.exports = cartonInventoryController;