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
  },

  // Paginated search with multi-term support
  findAllPaginated: async ({ page = 1, limit = 10, search = '' }) => {
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    // Multi-term search - split by space, must match ALL terms (AND logic)
    if (search && search.trim()) {
      const terms = search.trim().split(/\s+/).filter(t => t.length > 0);
      if (terms.length > 0) {
        const searchFields = ['account_name', 'code', 'balance'];

        const termConditions = terms.map(term => {
          const fieldConditions = searchFields.map(field => {
            queryParams.push(`%${term}%`);
            return `${field} LIKE ?`;
          }).join(' OR ');
          return `(${fieldConditions})`;
        });

        whereConditions.push(`(${termConditions.join(' AND ')})`);
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Count query
    const countQuery = `SELECT COUNT(*) as total FROM accounts ${whereClause}`;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    // Data query
    const dataQuery = `SELECT * FROM accounts ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
    const [rows] = await db.query(dataQuery, [...queryParams, limit, offset]);

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
};
module.exports = Account;