const Transport = require('../model/transport_model');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges');

const transportController = {
  addTransport: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'The "name" field is required.' });
      }
      const newTransport = await Transport.create(name);
      await logUserActivity(req, {
        model_name: 'transport',
        action_type: 'CREATE',
        record_id: newTransport.id,
        description: `Created transport ${name}`
      });
      res.status(201).json({ success: true, message: 'Transport added successfully', data: newTransport });
    } catch (error) {
      // Handle potential duplicate entry error
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'This transport name already exists.' });
      }
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getTransports: async (req, res) => {
    try {
      const transports = await Transport.findAll();
      res.status(200).json({ success: true, data: transports });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  updateTransport: async (req, res) => {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        return res.status(400).json({ success: false, message: 'Both "id" and "name" are required.' });
      }
      
      // Fetch old record before updating
      const oldRecord = await Transport.findById(id);
      if (!oldRecord) {
        return res.status(404).json({ success: false, message: 'Transport not found.' });
      }
      
      const affectedRows = await Transport.update(id, name);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Transport not found.' });
      }
      
      // Compare old vs new values and log changes
      const changes = compareChanges(oldRecord, { name });
      await logUserActivity(req, {
        model_name: 'transport',
        action_type: 'UPDATE',
        record_id: id,
        description: `Updated transport ${name}`,
        changes: changes
      });
      res.status(200).json({ success: true, message: 'Transport updated successfully.' });
    } catch (error) {
       if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'This transport name already exists.' });
      }
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  deleteTransport: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'The "id" field is required.' });
      }
      const affectedRows = await Transport.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Transport not found.' });
      }
      await logUserActivity(req, {
        model_name: 'transport',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted transport'
      });
      res.status(200).json({ success: true, message: 'Transport deleted successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  }
};

module.exports = transportController;
