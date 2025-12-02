const Account = require('../model/account_model');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges');

const accountController = {
  createAccount: async (req, res) => {
    try {
      const created_by = req.user.id;
      const newAccount = await Account.create({ ...req.body, created_by });
      // Log activity: account created
      await logUserActivity(req, {
        model_name: 'accounts',
        action_type: 'CREATE',
        record_id: newAccount.id,
        description: `Created account`
      });
      res.status(201).json({ success: true, data: newAccount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllAccounts: async (req, res) => {
    try {
      const accounts = await Account.findAll();
      res.status(200).json({ success: true, data: accounts });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // --- NEW: Controller for updating an account ---
  updateAccount: async (req, res) => {
    try {
      const { id, ...accountData } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Account ID is required in the body.' });
      }
      
      // Fetch old record before updating
      const oldRecord = await Account.findById(id);
      if (!oldRecord) {
        return res.status(404).json({ success: false, message: 'Account not found' });
      }
      
      const affectedRows = await Account.update(id, accountData);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Account not found' });
      }
      
      // Compare old vs new values and log changes
      const changes = compareChanges(oldRecord, accountData);
      await logUserActivity(req, {
        model_name: 'accounts',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated account',
        changes: changes
      });
      res.status(200).json({ success: true, message: 'Account updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // --- NEW: Controller for deleting an account ---
  deleteAccount: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Account ID is required in the body.' });
      }
      const affectedRows = await Account.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Account not found' });
      }
      await logUserActivity(req, {
        model_name: 'accounts',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted account'
      });
      res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  }
};
module.exports = accountController;