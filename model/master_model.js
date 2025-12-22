const db = require('../config/db');
const MasterItem = {
  create: async (itemData) => {
    const { item_code, description, kg_dz, created_by } = itemData;
    const query = 'INSERT INTO master_items (item_code, description, kg_dz, created_by) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [item_code, description, kg_dz, created_by]);
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
    const { item_code, description, kg_dz } = itemData;
    const query = 'UPDATE master_items SET item_code = ?, description = ?, kg_dz = ? WHERE id = ?';
    const [result] = await db.query(query, [item_code, description, kg_dz, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM master_items WHERE id = ?', [id]);
    return result.affectedRows;
  },
  findAllItemCodes: async () => {
    const [rows] = await db.query('SELECT item_code FROM master_items');
    return rows.map(row => row.item_code);
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