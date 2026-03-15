const Receipt = require('../model/receipt_model');
const { logUserActivity } = require('../utils/activityLogger');

const receiptController = {
  createReceipt: async (req, res) => {
    try {
      const user_id = req.user.id;
      const image_url = req.file ? req.file.path : null;

      const receiptData = {
        ...req.body,
        image_url: image_url,
        user_id: user_id
      };

      const newReceipt = await Receipt.create(receiptData);
      await logUserActivity(req, {
        model_name: 'receipts',
        action_type: 'CREATE',
        record_id: newReceipt.id,
        description: 'Created receipt'
      });
      res.status(201).json({ success: true, message: "Receipt created and account balance updated.", data: newReceipt });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getAllReceipts: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.body;

      const result = await Receipt.findAllPaginated({
        page: parseInt(page),
        limit: parseInt(limit),
        search: search || ''
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  updateReceipt: async (req, res) => {
    try {
      const receiptId = req.body.id;
      const user_id = req.user.id;
      const image_url = req.file ? req.file.path : null;
      const updateData = { ...req.body, user_id };
      if (image_url) updateData.image_url = image_url;

      const updatedReceipt = await Receipt.update(receiptId, updateData);
      await logUserActivity(req, {
        model_name: 'receipts',
        action_type: 'UPDATE',
        record_id: receiptId,
        description: 'Updated receipt'
      });
      res.status(200).json({ success: true, message: "Receipt updated successfully.", data: updatedReceipt });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  },

  deleteReceipt: async (req, res) => {
    try {
      const receiptId = req.body.id;
      await Receipt.delete(receiptId);
      await logUserActivity(req, {
        model_name: 'receipts',
        action_type: 'DELETE',
        record_id: receiptId,
        description: 'Deleted receipt'
      });
      res.status(200).json({ success: true, message: "Receipt deleted successfully." });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  },

  // Delete all receipts
  deleteAllReceipts: async (req, res) => {
    try {
      const result = await Receipt.deleteAll();
      await logUserActivity(req, {
        model_name: 'receipts',
        action_type: 'DELETE',
        description: `Deleted all receipts (${result.deletedCount} records)`
      });
      res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} receipts`,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  },

  // Batch delete multiple receipts by IDs
  batchDeleteReceipts: async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Request body must contain ids array.' });
      }

      let deletedCount = 0;
      const failed = [];

      for (const id of ids) {
        try {
          await Receipt.delete(id);
          deletedCount++;
          await logUserActivity(req, {
            model_name: 'receipts',
            action_type: 'DELETE',
            record_id: id,
            description: 'Deleted receipt (batch)'
          });
        } catch (error) {
          failed.push({ id, message: error.message });
        }
      }

      res.status(200).json({ success: true, deletedCount, failed });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }

};
module.exports = receiptController;