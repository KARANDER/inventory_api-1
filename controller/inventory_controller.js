const InventoryItem = require('../model/inventory_model');
const db = require('../config/db');
const { logUserActivity } = require('../utils/activityLogger');

const inventoryController = {
 createItem: async (req, res) => {
    try {
      const createdBy = req.user.id;
      const { item_code, user, stock_quantity, ...otherData } = req.body;

      // Combine item_code and user for a unique reference if needed
      const code_user = item_code + (user || '');

      // Prepare the data for the new inventory item
      const newItemData = {
        item_code,
        stock_quantity,
        user,
        ...otherData,
        code_user,
        created_by: createdBy,
      };

      // Create the new item in the inventory_items table
      const newItem = await InventoryItem.create(newItemData);

      // --- Conditional Logic for Supplier Stock Sync ---
      // After creating the item, check if it's from a supplier
      // and sync the stock quantity with the master list if so.
      const contactQuery = 'SELECT type FROM contacts WHERE code = ? LIMIT 1';
      const [contactRows] = await db.query(contactQuery, [user]);

      if (contactRows.length > 0 && contactRows[0].type === 'Supplier') {
        // If the contact is a supplier, check if the item exists in the master list
        const masterQuery = 'SELECT * FROM master_items WHERE item_code = ? LIMIT 1';
        const [masterRows] = await db.query(masterQuery, [item_code]);

        // If it exists, update the stock quantity to keep it in sync
        if (masterRows.length > 0) {
          const updateQuery = 'UPDATE master_items SET stock_quantity = ? WHERE item_code = ?';
          await db.query(updateQuery, [stock_quantity, item_code]);
        }
      }

      // Send a success response with the newly created item
      await logUserActivity(req, {
        model_name: 'inventory_items',
        action_type: 'CREATE',
        record_id: newItem.id,
        description: 'Created inventory item'
      });
      res.status(201).json({ success: true, data: newItem });

    } catch (error) {
      // Log any errors that occur and send a server error response
      console.error('Error in createItem:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
},


  getAllItems: async (req, res) => {
    try {
      const items = await InventoryItem.findAll();
      res.status(200).json({ success: true, data: items });
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
      const affectedRows = await InventoryItem.update(id, itemData);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      await logUserActivity(req, {
        model_name: 'inventory_items',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated inventory item'
      });
      res.status(200).json({ success: true, message: 'Item updated successfully' });
    } catch (error)      {
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
      const affectedRows = await InventoryItem.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      await logUserActivity(req, {
        model_name: 'inventory_items',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted inventory item'
      });
      res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  batchUpdateItems: async (req, res) => {
  try {
    const items = req.body; // Expecting array of { id, fieldsToUpdate }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Request body must be a non-empty array." });
    }
    const failed = [];
    const success = [];
    for (const itemData of items) {
      const { id, ...fieldsToUpdate } = itemData;
      if (!id) {
        failed.push({ id: null, message: "Missing id in update object" });
        continue;
      }
      try {
        const affected = await InventoryItem.update(id, fieldsToUpdate);
        if (affected === 0) {
          failed.push({ id, message: 'Item not found' });
        } else {
          success.push({ id });
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
    const { ids } = req.body; // Expecting { ids: [1, 2, 3] }
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "Request body must contain ids array." });
    }
    let deletedCount = 0;
    for (const id of ids) {
      try {
        const affected = await InventoryItem.delete(id);
        if (affected > 0) deletedCount++;
      } catch {
        // optionally handle/log failures
      }
    }
    res.status(200).json({ success: true, deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
},

searchItemsByItemCode: async (req, res) => {
  try {
    const { item_code } = req.body;
    if (!item_code) {
      return res.status(400).json({ success: false, message: "item_code is required in request body" });
    }
    // Partial search using LIKE
    const items = await InventoryItem.searchByItemCode(item_code);
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
},
getAllItemCodes: async (req, res) => {
    try {
        const itemCodes = await InventoryItem.findAllItemCodes();
        res.status(200).json({ 
            success: true, 
            data: itemCodes.map(row => row.item_code) 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server Error', 
            error: error.message 
        });
    }
},

getItemByItemCode: async (req, res) => {
  try {
    const { item_code } = req.body;
    if (!item_code) {
      return res.status(400).json({ success: false, message: "item_code is required" });
    }
    const item = await InventoryItem.searchByExactItemCode(item_code);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
},
  

};
module.exports = inventoryController;