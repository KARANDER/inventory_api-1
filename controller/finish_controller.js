const Finishes = require('../model/finish_model');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges');

const finishesController = {
  addFinish: async (req, res) => {
    try {
      const { finish } = req.body;
      const newFinish = await Finishes.create(finish);
      await logUserActivity(req, {
        model_name: 'finishes',
        action_type: 'CREATE',
        record_id: newFinish.id,
        description: 'Created finish'
      });
      res.status(201).json({ success: true, data: newFinish });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getFinishes: async (req, res) => {
    try {
      const finishes = await Finishes.getAll();
      res.status(200).json({ success: true, data: finishes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateFinish: async (req, res) => {
    try {
      const { id, finish } = req.body;
      
      // Fetch old record before updating
      const oldRecord = await Finishes.findById(id);
      if (!oldRecord) {
        return res.status(404).json({ success: false, message: 'Finish not found' });
      }
      
      const affectedRows = await Finishes.update(id, finish);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Finish not found' });
      }
      
      // Compare old vs new values and log changes
      const changes = compareChanges(oldRecord, { finish });
      await logUserActivity(req, {
        model_name: 'finishes',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated finish',
        changes: changes
      });
      res.status(200).json({ success: true, message: 'Finish updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteFinish: async (req, res) => {
    try {
      const { id } = req.body;
      const affectedRows = await Finishes.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Finish not found' });
      }
      await logUserActivity(req, {
        model_name: 'finishes',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted finish'
      });
      res.status(200).json({ success: true, message: 'Finish deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = finishesController;
