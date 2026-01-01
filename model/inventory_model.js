const db = require('../config/db');
const InventoryItem = {
  create: async (itemData) => {
    const columns = Object.keys(itemData);
    const values = Object.values(itemData);
    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO inventory_items (${columns.join(', ')}) VALUES (${placeholders})`;
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...itemData };
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM inventory_items');
    return rows;
  },

  // Paginated search with multi-term support
  findAllPaginated: async ({ page = 1, limit = 10, search = '' }) => {
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    if (search && search.trim()) {
      const terms = search.trim().split(/\s+/).filter(t => t.length > 0);
      if (terms.length > 0) {
        const searchFields = ['item_code', 'code_user', 'user', 'description', 'finish'];

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

    const countQuery = `SELECT COUNT(*) as total FROM inventory_items ${whereClause}`;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    const dataQuery = `SELECT * FROM inventory_items ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
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
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM inventory_items WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, itemData) => {
    const updates = Object.keys(itemData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(itemData), id];
    const query = `UPDATE inventory_items SET ${updates} WHERE id = ?`;
    const [result] = await db.query(query, values);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM inventory_items WHERE id = ?', [id]);
    return result.affectedRows;
  },
  searchByItemCode: async (itemCode) => {
    const query = `SELECT * FROM inventory_items WHERE item_code LIKE ? ORDER BY id DESC`;
    const [rows] = await db.query(query, [`%${itemCode}%`]);
    return rows;
  },
  findAllItemCodes: async () => {
    const [rows] = await db.query('SELECT DISTINCT item_code FROM inventory_items ORDER BY item_code');
    return rows;
  },
  searchByExactItemCode: async (itemCode) => {
    const query = `SELECT description, kg_dz FROM master_items WHERE item_code = ? LIMIT 1`;
    const rows = await db.query(query, [itemCode]);
    return rows[0] || null;
  },

};
module.exports = InventoryItem;