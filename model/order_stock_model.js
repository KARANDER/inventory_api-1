const db = require('../config/db');

const OrderStock = {
  create: async (order_stock) => {
    const query = 'INSERT INTO order_stock (order_stock) VALUES (?)';
    const [result] = await db.query(query, [order_stock]);
    return { id: result.insertId, order_stock };
  },

  getAll: async () => {
    const query = 'SELECT * FROM order_stock ORDER BY id ASC';
    const [rows] = await db.query(query);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM order_stock WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  update: async (id, order_stock) => {
    const query = 'UPDATE order_stock SET order_stock = ? WHERE id = ?';
    const [result] = await db.query(query, [order_stock, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const query = 'DELETE FROM order_stock WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
  }
};

module.exports = OrderStock;
