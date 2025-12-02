const db = require('../config/db');

const Finishes = {
  create: async (finish) => {
    const query = 'INSERT INTO finishes_table (finish) VALUES (?)';
    const [result] = await db.query(query, [finish]);
    return { id: result.insertId, finish };
  },

  getAll: async () => {
    const query = 'SELECT * FROM finishes_table ORDER BY id ASC';
    const [rows] = await db.query(query);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM finishes_table WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  update: async (id, finish) => {
    const query = 'UPDATE finishes_table SET finish = ? WHERE id = ?';
    const [result] = await db.query(query, [finish, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const query = 'DELETE FROM finishes_table WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
  }
};

module.exports = Finishes;
