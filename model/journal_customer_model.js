const db = require('../config/db');

const JournalCustomerModel = {
  // Get all customers
  getAll: async () => {
    const query = 'SELECT * FROM journal_customers ORDER BY name ASC';
    const [rows] = await db.query(query);
    return rows;
  },

  // Get customer by ID
  getById: async (id) => {
    const query = 'SELECT * FROM journal_customers WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0] || null;
  },

  // Create new customer
  create: async ({ name, notes = null }) => {
    const query = 'INSERT INTO journal_customers (name, notes) VALUES (?, ?)';
    const [result] = await db.query(query, [name, notes]);
    return {
      id: result.insertId,
      name,
      notes,
    };
  },

  // Update customer
  update: async (id, { name, notes }) => {
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }

    if (updates.length === 0) {
      return await JournalCustomerModel.getById(id);
    }

    values.push(id);
    const query = `UPDATE journal_customers SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return null;
    }

    return await JournalCustomerModel.getById(id);
  },

  // Delete customer (only if not used in journal_entries)
  delete: async (id) => {
    // Check if customer is used in journal entries by name
    const customer = await JournalCustomerModel.getById(id);
    if (!customer) {
      return false;
    }

    const checkQuery = 'SELECT COUNT(*) AS count FROM journal_entries WHERE customer_name = ?';
    const [checkRows] = await db.query(checkQuery, [customer.name]);

    if (checkRows[0].count > 0) {
      throw new Error('Cannot delete customer that is used in journal entries');
    }

    const query = 'DELETE FROM journal_customers WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  },
};

module.exports = JournalCustomerModel;


