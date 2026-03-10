const MasterItem = require('../model/master_model');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges');

const masterController = {
  createItem: async (req, res) => {
    try {
      const created_by = req.user.id;
      const newItem = await MasterItem.create({ ...req.body, created_by });
      await logUserActivity(req, {
        model_name: 'master_items',
        action_type: 'CREATE',
        record_id: newItem.id,
        description: 'Created master item'
      });
      res.status(201).json({ success: true, data: newItem });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllItems: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.body;

      // Fetch paginated master items and all cartons
      const [result, cartons] = await Promise.all([
        MasterItem.findAllPaginated({
          page: parseInt(page),
          limit: parseInt(limit),
          search: search || ''
        }),
        MasterItem.findAllCorton()
      ]);

      res.status(200).json({
        success: true,
        data: {
          masterItems: result.data,
          cartonInventory: cartons
        },
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  updateItem: async (req, res) => {
    try {
      // Get ID from the request body
      const { id, ...itemData } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Item ID is required in the body.' });
      }

      // Fetch old record before updating
      const oldRecord = await MasterItem.findById(id);
      if (!oldRecord) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }

      const affectedRows = await MasterItem.update(id, itemData);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }

      // Compare old vs new values and log changes
      const changes = compareChanges(oldRecord, itemData);
      await logUserActivity(req, {
        model_name: 'master_items',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated master item',
        changes: changes
      });
      res.status(200).json({ success: true, message: 'Item updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  deleteItem: async (req, res) => {
    try {
      // Get ID from the request body
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Item ID is required in the body.' });
      }
      const affectedRows = await MasterItem.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      await logUserActivity(req, {
        model_name: 'master_items',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted master item'
      });
      res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getItemCodes: async (req, res) => {
    try {
      const itemCodes = await MasterItem.findAllItemCodes();
      res.status(200).json({ success: true, data: itemCodes });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  batchUpdateItems: async (req, res) => {
    try {
      const items = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Request body must be a non-empty array.' });
      }

      const failed = [];
      const success = [];

      for (const itemData of items) {
        const { id, ...fieldsToUpdate } = itemData;
        if (!id) {
          failed.push({ id: null, message: 'Missing id in update object' });
          continue;
        }
        try {
          const oldRecord = await MasterItem.findById(id);
          if (!oldRecord) {
            failed.push({ id, message: 'Master item not found' });
            continue;
          }
          const affected = await MasterItem.update(id, fieldsToUpdate);
          if (affected === 0) {
            failed.push({ id, message: 'Master item not found' });
          } else {
            success.push({ id });
            const changes = compareChanges(oldRecord, fieldsToUpdate);
            await logUserActivity(req, {
              model_name: 'master_items',
              action_type: 'UPDATE',
              record_id: id,
              description: 'Updated master item (batch)',
              changes: changes
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

  batchDeleteItems: async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Request body must contain ids array.' });
      }

      let deletedCount = 0;
      const failed = [];

      for (const id of ids) {
        try {
          const affected = await MasterItem.delete(id);
          if (affected > 0) {
            deletedCount++;
            await logUserActivity(req, {
              model_name: 'master_items',
              action_type: 'DELETE',
              record_id: id,
              description: 'Deleted master item (batch)'
            });
          } else {
            failed.push({ id, message: 'Master item not found' });
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
module.exports = masterController;