const InventoryItem = require('../model/inventory_model');
const db = require('../config/db');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges');
const SalesLock = require('../model/sales_lock_model');

const toNum = (value) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

const buildAdjustmentDisplay = (rawAdjustment) => {
  if (rawAdjustment === null || rawAdjustment === undefined) return null;
  const text = String(rawAdjustment).trim();
  if (!text) return null;
  if (text.endsWith('%')) return text;
  const fixed = parseFloat(text);
  if (Number.isFinite(fixed)) return `Rs ${fixed}`;
  return text;
};

const applyRateAdjustment = ({ baseRate, rawAdjustment }) => {
  const normalizedBase = toNum(baseRate);

  if (rawAdjustment === null || rawAdjustment === undefined || String(rawAdjustment).trim() === '') {
    return {
      calculatedRatePcs: normalizedBase,
      normalizedAdjustment: null
    };
  }

  const text = String(rawAdjustment).trim();
  let adjustmentAmount = 0;

  if (text.endsWith('%')) {
    const percent = parseFloat(text.slice(0, -1).trim());
    if (!Number.isFinite(percent)) {
      throw new Error('Invalid rate_adjustment. Use format like 2 or 2%.');
    }
    adjustmentAmount = (normalizedBase * percent) / 100;
  } else {
    const fixedAmount = parseFloat(text);
    if (!Number.isFinite(fixedAmount)) {
      throw new Error('Invalid rate_adjustment. Use format like 2 or 2%.');
    }
    adjustmentAmount = fixedAmount;
  }

  const finalRate = normalizedBase + adjustmentAmount;
  return {
    calculatedRatePcs: finalRate,
    normalizedAdjustment: text
  };
};

const resolveBaseRateForAdjustment = (oldRecord) => {
  const hasStoredBase = oldRecord.base_rate_pcs !== null && oldRecord.base_rate_pcs !== undefined;
  const storedBase = toNum(oldRecord.base_rate_pcs);
  const currentRate = toNum(oldRecord.rate_pcs);

  // Legacy recovery: some migrated rows have base_rate_pcs = 0 while current rate is non-zero.
  const looksLegacyBroken = hasStoredBase && storedBase === 0 && currentRate !== 0;

  if (!hasStoredBase || looksLegacyBroken) {
    return { baseRate: currentRate, shouldPersistBase: true };
  }

  return { baseRate: storedBase, shouldPersistBase: false };
};

const normalizeOrderModeFields = (payload) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'order_per_pics_kg')) return;

  const raw = payload.order_per_pics_kg;
  delete payload.order_per_pics_kg;

  if (raw === null || raw === undefined || String(raw).trim() === '') {
    payload.pic_or_kg = null;
    return;
  }

  if (typeof raw === 'number') {
    payload.pic_or_kg = raw === 1 ? 1 : 0;
    return;
  }

  const text = String(raw).trim().toLowerCase();
  if (['per_kg', 'kg', '1', 'true', 'yes'].includes(text)) {
    payload.pic_or_kg = 1;
  } else if (['per_pics', 'per_pic', 'per_pcs', 'pics', 'pcs', 'pic', '0', 'false', 'no'].includes(text)) {
    payload.pic_or_kg = 0;
  } else {
    payload.pic_or_kg = null;
  }
};

const buildOrderModeDisplay = (picOrKg) => {
  if (picOrKg === null || picOrKg === undefined) return null;
  const n = parseInt(picOrKg, 10);
  if (!Number.isFinite(n)) return null;
  return n === 1 ? 'per_kg' : 'per_pics';
};

const applyRateFieldsForExistingItemUpdate = (payload, oldRecord) => {
  const hasAdjustmentInput = Object.prototype.hasOwnProperty.call(payload, 'rate_adjustment');
  const hasBaseInput = Object.prototype.hasOwnProperty.call(payload, 'base_rate_pcs');

  const {
    baseRate: resolvedBaseRate,
    shouldPersistBase
  } = resolveBaseRateForAdjustment(oldRecord);

  const incomingBaseRate = hasBaseInput ? toNum(payload.base_rate_pcs) : null;

  // Case 1: User entered adjustment (optionally with a new base).
  if (hasAdjustmentInput) {
    const baseForCalculation = hasBaseInput ? incomingBaseRate : resolvedBaseRate;
    const { calculatedRatePcs, normalizedAdjustment } = applyRateAdjustment({
      baseRate: baseForCalculation,
      rawAdjustment: payload.rate_adjustment
    });

    payload.base_rate_pcs = baseForCalculation;
    payload.rate_adjustment = normalizedAdjustment;
    payload.rate_pcs = calculatedRatePcs;
    return;
  }

  // Case 2: User changed only base rate.
  if (hasBaseInput) {
    // Only sync rate fields when base actually changed, so full-row updates don't reset values accidentally.
    if (incomingBaseRate !== resolvedBaseRate || shouldPersistBase) {
      payload.base_rate_pcs = incomingBaseRate;
      payload.rate_adjustment = null;
      payload.rate_pcs = incomingBaseRate;
    } else {
      delete payload.base_rate_pcs;
    }
  }
};

const formatItemForResponse = (item) => ({
  ...item,
  rate_adjustment_display: buildAdjustmentDisplay(item.rate_adjustment),
  order_per_pics_kg: buildOrderModeDisplay(item.pic_or_kg)
});

const inventoryController = {
  createItem: async (req, res) => {
    try {
      // Check if inventory items module is locked
      const isLocked = await SalesLock.isLocked('inventory_items');
      if (isLocked) {
        return res.status(403).json({
          success: false,
          message: 'Inventory Items are currently locked. Cannot create inventory items.'
        });
      }

      const createdBy = req.user.id;
      const { item_code, user, stock_quantity, rate_adjustment, ...otherData } = req.body;

      // Combine item_code and user for a unique reference if needed
      const code_user = item_code + (user || '');

      // Store the initial base rate (never changes unless explicitly edited later)
      const hasBaseRateInput = Object.prototype.hasOwnProperty.call(req.body, 'base_rate_pcs');
      const baseRatePcs = hasBaseRateInput ? toNum(req.body.base_rate_pcs) : toNum(otherData.rate_pcs);
      const { calculatedRatePcs, normalizedAdjustment } = applyRateAdjustment({
        baseRate: baseRatePcs,
        rawAdjustment: rate_adjustment
      });

      // Prepare the data for the new inventory item
      const newItemData = {
        item_code,
        stock_quantity,
        user,
        ...otherData,
        rate_adjustment: normalizedAdjustment,
        base_rate_pcs: baseRatePcs,
        rate_pcs: calculatedRatePcs,
        code_user,
        created_by: createdBy,
      };

      normalizeOrderModeFields(newItemData);

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
      res.status(201).json({ success: true, data: formatItemForResponse(newItem) });

    } catch (error) {
      // Log any errors that occur and send a server error response
      console.error('Error in createItem:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },


  getAllItems: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.body;

      const result = await InventoryItem.findAllPaginated({
        page: parseInt(page),
        limit: parseInt(limit),
        search: search || ''
      });

      const formattedData = result.data.map(formatItemForResponse);

      res.status(200).json({
        success: true,
        data: formattedData,
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
      const oldRecord = await InventoryItem.findById(id);
      if (!oldRecord) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }

      normalizeOrderModeFields(itemData);

      applyRateFieldsForExistingItemUpdate(itemData, oldRecord);

      const affectedRows = await InventoryItem.update(id, itemData);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }

      // Compare old vs new values and log changes
      const changes = compareChanges(oldRecord, itemData);
      await logUserActivity(req, {
        model_name: 'inventory_items',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated inventory item',
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
      const created = [];

      for (const itemData of items) {
        const { id, ...fieldsToUpdate } = itemData;

        // No id = new record, create it
        if (!id) {
          try {
            normalizeOrderModeFields(fieldsToUpdate);

            const hasBaseRateInput = Object.prototype.hasOwnProperty.call(itemData, 'base_rate_pcs');
            const baseRateForCreate = hasBaseRateInput ? toNum(itemData.base_rate_pcs) : toNum(fieldsToUpdate.rate_pcs);
            fieldsToUpdate.base_rate_pcs = baseRateForCreate;

            if (Object.prototype.hasOwnProperty.call(itemData, 'rate_adjustment')) {
              const { calculatedRatePcs, normalizedAdjustment } = applyRateAdjustment({
                baseRate: baseRateForCreate,
                rawAdjustment: itemData.rate_adjustment
              });
              fieldsToUpdate.base_rate_pcs = baseRateForCreate;
              fieldsToUpdate.rate_adjustment = normalizedAdjustment;
              fieldsToUpdate.rate_pcs = calculatedRatePcs;
            } else {
              fieldsToUpdate.rate_pcs = baseRateForCreate;
            }
            const newItem = await InventoryItem.create(fieldsToUpdate);
            created.push({ id: newItem.id });
          } catch (error) {
            failed.push({ id: null, message: error.message });
          }
          continue;
        }

        try {
          normalizeOrderModeFields(fieldsToUpdate);

          if (
            Object.prototype.hasOwnProperty.call(itemData, 'rate_adjustment') ||
            Object.prototype.hasOwnProperty.call(itemData, 'base_rate_pcs')
          ) {
            const oldRecord = await InventoryItem.findById(id);
            if (!oldRecord) {
              failed.push({ id, message: 'Item not found' });
              continue;
            }
            applyRateFieldsForExistingItemUpdate(fieldsToUpdate, oldRecord);
          }

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
      res.status(200).json({ success: true, updated: success.length, created: created.length, failed });
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
      res.status(200).json({ success: true, data: items.map(formatItemForResponse) });
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