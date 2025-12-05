const db = require('../config/db');

const JournalEntryModel = {
  // Create new journal entry
  create: async (entryData) => {
    const { date, type, customer_name, method_id, amount, notes, user_id } = entryData;
    const query = `
      INSERT INTO journal_entries (date, type, customer_name, method_id, amount, notes, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [date, type, customer_name, method_id, amount, notes || null, user_id]);
    return await JournalEntryModel.getById(result.insertId);
  },

  // Get all journal entries with optional filters
  getAll: async (filters = {}) => {
    let query = `
      SELECT 
        je.*,
        pm.name as method_name
      FROM journal_entries je
      LEFT JOIN payment_methods pm ON je.method_id = pm.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.search) {
      query += ' AND (je.customer_name LIKE ? OR pm.name LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.type) {
      query += ' AND je.type = ?';
      params.push(filters.type);
    }

    if (filters.startDate) {
      query += ' AND je.date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND je.date <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY je.date DESC, je.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  // Get journal entry by ID
  getById: async (id) => {
    const query = `
      SELECT 
        je.*,
        pm.name as method_name
      FROM journal_entries je
      LEFT JOIN payment_methods pm ON je.method_id = pm.id
      WHERE je.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0] || null;
  },

  // Update journal entry
  update: async (id, entryData) => {
    const { date, type, customer_name, method_id, amount, notes } = entryData;
    const updateKeys = [];
    const updateValues = [];

    if (date !== undefined) {
      updateKeys.push('date = ?');
      updateValues.push(date);
    }
    if (type !== undefined) {
      updateKeys.push('type = ?');
      updateValues.push(type);
    }
    if (customer_name !== undefined) {
      updateKeys.push('customer_name = ?');
      updateValues.push(customer_name);
    }
    if (method_id !== undefined) {
      updateKeys.push('method_id = ?');
      updateValues.push(method_id);
    }
    if (amount !== undefined) {
      updateKeys.push('amount = ?');
      updateValues.push(amount);
    }
    if (notes !== undefined) {
      updateKeys.push('notes = ?');
      updateValues.push(notes || null);
    }

    if (updateKeys.length === 0) {
      return await JournalEntryModel.getById(id);
    }

    updateValues.push(id);
    const query = `UPDATE journal_entries SET ${updateKeys.join(', ')} WHERE id = ?`;
    const [result] = await db.query(query, updateValues);

    if (result.affectedRows === 0) {
      return null;
    }

    return await JournalEntryModel.getById(id);
  },

  // Delete journal entry
  delete: async (id) => {
    const query = 'DELETE FROM journal_entries WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  },

  // Get metrics (Total Receipts, Total Payments, Remaining Balance)
  getMetrics: async (filters = {}) => {
    let query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'Receipt' THEN amount ELSE 0 END), 0) as total_receipts,
        COALESCE(SUM(CASE WHEN type = 'Payment' THEN amount ELSE 0 END), 0) as total_payments
      FROM journal_entries
      WHERE 1=1
    `;
    const params = [];

    if (filters.startDate) {
      query += ' AND date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND date <= ?';
      params.push(filters.endDate);
    }

    const [rows] = await db.query(query, params);
    const metrics = rows[0] || { total_receipts: 0, total_payments: 0 };
    
    const totalReceipts = parseFloat(metrics.total_receipts) || 0;
    const totalPayments = parseFloat(metrics.total_payments) || 0;
    const remainingBalance = totalReceipts - totalPayments;

    return {
      total_receipts: totalReceipts,
      total_payments: totalPayments,
      remaining_balance: remainingBalance
    };
  }
};

module.exports = JournalEntryModel;

