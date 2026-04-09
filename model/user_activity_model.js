const db = require('../config/db');

const UserActivity = {
  // Generic logger used by controllers
  log: async ({ user_id, user_name, model_name, action_type, record_id, description, changes }) => {
    if (!user_id || !user_name || !model_name || !action_type) return;

    const query = `
      INSERT INTO user_activity
      (user_id, user_name, model_name, action_type, record_id, description, changes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      user_id,
      user_name,
      model_name,
      action_type,
      record_id || null,
      description || null,
      changes ? JSON.stringify(changes) : null
    ];

    await db.query(query, values);
  },

  // History for all models
  findAll: async (filters = {}) => {
    let query = 'SELECT * FROM user_activity WHERE 1=1';
    const values = [];

    if (filters.user_id) {
      query += ' AND user_id = ?';
      values.push(filters.user_id);
    }

    if (filters.model_name) {
      query += ' AND model_name = ?';
      values.push(filters.model_name);
    }

    if (filters.action_type) {
      query += ' AND action_type = ?';
      values.push(filters.action_type);
    }

    if (filters.start_date) {
      query += ' AND created_at >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND created_at <= ?';
      values.push(filters.end_date);
    }

    query += ' ORDER BY created_at DESC';

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

  batchDeleteByIds: async (ids = []) => {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { deletedCount: 0, notFoundIds: [] };
    }

    const [existingRows] = await db.query(
      'SELECT id FROM user_activity WHERE id IN (?)',
      [ids]
    );

    const existingIds = existingRows.map(row => row.id);
    const existingSet = new Set(existingIds);
    const notFoundIds = ids.filter(id => !existingSet.has(id));

    let deletedCount = 0;
    if (existingIds.length > 0) {
      const [deleteResult] = await db.query(
        'DELETE FROM user_activity WHERE id IN (?)',
        [existingIds]
      );
      deletedCount = deleteResult.affectedRows || 0;
    }

    return { deletedCount, notFoundIds };
  }
};

module.exports = UserActivity;

