const db = require('../config/db');

const Transport = {
  create: async (name) => {
    const query = 'INSERT INTO transport (name) VALUES (?)';
    const [result] = await db.query(query, [name]);
    return { id: result.insertId, name };
  },

  findAll: async () => {
    const query = 'SELECT * FROM transport ORDER BY name ASC';
    const [rows] = await db.query(query);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM transport WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  update: async (id, name) => {
    const query = 'UPDATE transport SET name = ? WHERE id = ?';
    const [result] = await db.query(query, [name, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const query = 'DELETE FROM transport WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
  }
};

module.exports = Transport;
