const db = require('../config/db');

const Account = {
  create: async (accountData) => {
    const { account_name, balance, code, created_by } = accountData;
    const query = 'INSERT INTO accounts (account_name, balance, code, created_by) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [account_name, balance || 0.00, code, created_by]);
    return { id: result.insertId, ...accountData };
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM accounts');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM accounts WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // --- NEW: Function to update an account ---
  update: async (id, accountData) => {
    const fields = Object.keys(accountData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = [...fields.map(field => accountData[field]), id];

    if (fields.length === 0) {
      return 0; // Nothing to update
    }

    const query = `UPDATE accounts SET ${setClause} WHERE id = ?`;
    const [result] = await db.query(query, values);
    return result.affectedRows;
  },

  // --- NEW: Function to delete an account ---
  delete: async (id) => {
    const query = 'DELETE FROM accounts WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
  }
};
module.exports = Account;