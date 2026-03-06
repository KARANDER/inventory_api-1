const db = require('../config/db');

const CartonInventory = {
  /**
   * Creates a new carton in the database.
   * @param {object} cartonData - The data for the new carton.
   * @param {string} cartonData.carton_name - The unique name of the carton.
   * @param {number} cartonData.carton_quantity - The initial quantity of the carton.
   * @param {number} cartonData.created_by - The ID of the user creating the carton.
   * @returns {Promise<object>} The newly created carton object.
   */
  create: async (cartonData) => {
    const { carton_name, carton_quantity, ctn_wt, created_by } = cartonData;
    const query = 'INSERT INTO carton_inventory (carton_name, carton_quantity, ctn_wt, created_by) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [carton_name, carton_quantity, ctn_wt || 0, created_by]);
    return { id: result.insertId, ...cartonData };
  },
  findAllCartonNames: async () => {
    const [rows] = await db.query('SELECT carton_name, ctn_wt FROM carton_inventory');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM carton_inventory WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  update: async (id, cartonData) => {
    const { carton_name, carton_quantity, ctn_wt } = cartonData;
    const query = 'UPDATE carton_inventory SET carton_name = ?, carton_quantity = ?, ctn_wt = ? WHERE id = ?';
    const [result] = await db.query(query, [carton_name, carton_quantity, ctn_wt || 0, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const query = 'DELETE FROM carton_inventory WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
  },
};

module.exports = CartonInventory;