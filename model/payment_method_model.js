const db = require('../config/db');

const PaymentMethodModel = {
  // Get all payment methods
  getAll: async () => {
    const query = 'SELECT * FROM payment_methods ORDER BY name ASC';
    const [rows] = await db.query(query);
    return rows;
  },

  // Get payment method by ID
  getById: async (id) => {
    const query = 'SELECT * FROM payment_methods WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0] || null;
  },

  // Create new payment method
  create: async (name) => {
    const query = 'INSERT INTO payment_methods (name) VALUES (?)';
    const [result] = await db.query(query, [name]);
    return { id: result.insertId, name, created_at: new Date(), updated_at: new Date() };
  },

  // Update payment method
  update: async (id, name) => {
    const query = 'UPDATE payment_methods SET name = ? WHERE id = ?';
    const [result] = await db.query(query, [name, id]);
    if (result.affectedRows === 0) {
      return null;
    }
    return await PaymentMethodModel.getById(id);
  },

  // Delete payment method
  delete: async (id) => {
    // Check if method is used in journal entries
    const checkQuery = 'SELECT COUNT(*) as count FROM journal_entries WHERE method_id = ?';
    const [checkRows] = await db.query(checkQuery, [id]);
    
    if (checkRows[0].count > 0) {
      throw new Error('Cannot delete payment method that is used in journal entries');
    }

    const query = 'DELETE FROM payment_methods WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  }
};

module.exports = PaymentMethodModel;

