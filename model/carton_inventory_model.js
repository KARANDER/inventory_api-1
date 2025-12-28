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
    const { carton_name, carton_quantity, created_by } = cartonData;
    const query = 'INSERT INTO carton_inventory (carton_name, carton_quantity, created_by) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [carton_name, carton_quantity, created_by]);
    return { id: result.insertId, ...cartonData };
  },
  findAllCartonNames: async () => {
    const [rows] = await db.query('SELECT carton_name FROM carton_inventory');
    return rows.map(row => row.carton_name);
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM carton_inventory WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  update: async (id, cartonData) => {
    const { carton_name, carton_quantity } = cartonData;
    const query = 'UPDATE carton_inventory SET carton_name = ?, carton_quantity = ? WHERE id = ?';
    const [result] = await db.query(query, [carton_name, carton_quantity, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const query = 'DELETE FROM carton_inventory WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
  },
};

module.exports = CartonInventory;