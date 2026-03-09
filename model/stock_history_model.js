const db = require('../config/db');

const StockHistory = {
  create: async (data) => {
    const {
      item_code,
      transaction_type, // 'CREDIT' or 'DEBIT'
      invoice_type,     // 'PURCHASE' or 'SALES'
      invoice_number,
      quantity_pcs,
      quantity_kg,
      movement_date,
      note,
      user_id
    } = data;

    const query = `
      INSERT INTO stock_history 
      (item_code, transaction_type, invoice_type, invoice_number,
       quantity_pcs, quantity_kg, movement_date, note, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      item_code,
      transaction_type,
      invoice_type,
      invoice_number || null,
      quantity_pcs || 0,
      quantity_kg || 0,
      movement_date,
      note || null,
      user_id || null
    ];

    const [result] = await db.query(query, values);
    return { id: result.insertId, ...data };
  },

  findByItemCode: async (itemCode, filters = {}) => {
    let whereClause = ' WHERE item_code = ?';
    const values = [itemCode];

    if (filters.start_date) {
      whereClause += ' AND movement_date >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      whereClause += ' AND movement_date <= ?';
      values.push(filters.end_date);
    }

    if (filters.transaction_type) {
      whereClause += ' AND transaction_type = ?';
      values.push(filters.transaction_type);
    }

    if (filters.invoice_type) {
      whereClause += ' AND invoice_type = ?';
      values.push(filters.invoice_type);
    }

    // Count query for pagination
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM stock_history' + whereClause, values);
    const total = countResult[0].total;

    let query = 'SELECT * FROM stock_history' + whereClause + ' ORDER BY movement_date DESC, created_at DESC';
    const dataValues = [...values];

    if (filters.limit) {
      query += ' LIMIT ?';
      dataValues.push(parseInt(filters.limit));

      if (filters.offset !== undefined) {
        query += ' OFFSET ?';
        dataValues.push(parseInt(filters.offset));
      }
    }

    const [rows] = await db.query(query, dataValues);
    return { rows, total };
  },

  findAll: async (filters = {}) => {
    let query = 'SELECT * FROM stock_history WHERE 1=1';
    const values = [];

    if (filters.item_code) {
      query += ' AND item_code = ?';
      values.push(filters.item_code);
    }

    if (filters.start_date) {
      query += ' AND movement_date >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND movement_date <= ?';
      values.push(filters.end_date);
    }

    if (filters.transaction_type) {
      query += ' AND transaction_type = ?';
      values.push(filters.transaction_type);
    }

    if (filters.invoice_type) {
      query += ' AND invoice_type = ?';
      values.push(filters.invoice_type);
    }

    query += ' ORDER BY movement_date DESC, created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      values.push(parseInt(filters.limit));

      if (filters.offset) {
        query += ' OFFSET ?';
        values.push(parseInt(filters.offset));
      }
    }

    const [rows] = await db.query(query, values);
    return rows;
  },

  getSummaryByItemCode: async (itemCode, filters = {}) => {
    let query = `
      SELECT
        item_code,
        SUM(CASE WHEN transaction_type = 'CREDIT' THEN quantity_pcs ELSE 0 END) AS total_credit_pcs,
        SUM(CASE WHEN transaction_type = 'DEBIT'  THEN quantity_pcs ELSE 0 END) AS total_debit_pcs,
        SUM(CASE WHEN transaction_type = 'CREDIT' THEN quantity_kg  ELSE 0 END) AS total_credit_kg,
        SUM(CASE WHEN transaction_type = 'DEBIT'  THEN quantity_kg  ELSE 0 END) AS total_debit_kg,
        COUNT(*) AS total_transactions,
        MIN(movement_date) AS first_movement_date,
        MAX(movement_date) AS last_movement_date
      FROM stock_history
      WHERE item_code = ?
    `;

    const values = [itemCode];

    if (filters.start_date) {
      query += ' AND movement_date >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND movement_date <= ?';
      values.push(filters.end_date);
    }

    const [rows] = await db.query(query, values);
    return rows[0] || null;
  }
};

module.exports = StockHistory;

