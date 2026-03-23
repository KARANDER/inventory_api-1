const db = require('../config/db');
const MasterItem = {
  create: async (itemData) => {
    const { item_code, description, kg_dz, stock_quantity, stock_kg, created_by } = itemData;
    const query = 'INSERT INTO master_items (item_code, description, kg_dz, stock_quantity, stock_kg, created_by) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [item_code, description, kg_dz, stock_quantity ?? 0, stock_kg ?? 0, created_by]);
    return { id: result.insertId, ...itemData };
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM master_items');
    return rows;
  },

  findAllCorton: async () => {
    const [rows] = await db.query('SELECT * FROM carton_inventory');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM master_items WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, itemData) => {
    const allowedFields = ['item_code', 'description', 'kg_dz', 'stock_quantity', 'stock_kg'];
    const fields = Object.keys(itemData).filter(key => allowedFields.includes(key) && itemData[key] !== undefined);
    if (fields.length === 0) return 0;
    const setClauses = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => itemData[f]);
    const [result] = await db.query(`UPDATE master_items SET ${setClauses} WHERE id = ?`, [...values, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM master_items WHERE id = ?', [id]);
    return result.affectedRows;
  },
  findAllItemCodes: async () => {
    const [rows] = await db.query('SELECT item_code, description FROM master_items ORDER BY item_code');
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
        const searchFields = ['item_code', 'description', 'kg_dz'];

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

    const countQuery = `SELECT COUNT(*) as total FROM master_items ${whereClause}`;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    const dataQuery = `SELECT * FROM master_items ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
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

};
module.exports = MasterItem;