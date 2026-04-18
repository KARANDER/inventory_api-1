const db = require('../config/db');

const JournalEntryTypeModel = {
    // Create new journal entry type
    create: async (typeData) => {
        const { name, description, created_by, user_ids } = typeData;
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // 1. Create the journal entry type
            const typeQuery = `
        INSERT INTO journal_entry_types (name, description, created_by)
        VALUES (?, ?, ?)
      `;
            const [result] = await connection.query(typeQuery, [name, description || null, created_by]);
            const typeId = result.insertId;

            // 2. Add permissions for specified users
            if (user_ids && user_ids.length > 0) {
                const permissionQuery = 'INSERT INTO journal_entry_type_permissions (entry_type_id, user_id) VALUES ?';
                const permissionValues = user_ids.map(userId => [typeId, userId]);
                await connection.query(permissionQuery, [permissionValues]);
            }

            await connection.commit();
            return await JournalEntryTypeModel.getById(typeId);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // Get all journal entry types accessible by a user
    getAllByUser: async (userId) => {
        const query = `
      SELECT DISTINCT
        jet.*,
        u.user_name as created_by_name,
        (SELECT COUNT(*) FROM journal_entries WHERE entry_type_id = jet.id) as entry_count
      FROM journal_entry_types jet
      LEFT JOIN users u ON jet.created_by = u.id
      INNER JOIN journal_entry_type_permissions jetp ON jet.id = jetp.entry_type_id
      WHERE jetp.user_id = ?
      ORDER BY jet.name ASC
    `;
        const [rows] = await db.query(query, [userId]);
        return rows;
    },

    // Get all journal entry types (admin view)
    getAll: async () => {
        const query = `
      SELECT 
        jet.*,
        u.user_name as created_by_name,
        (SELECT COUNT(*) FROM journal_entries WHERE entry_type_id = jet.id) as entry_count
      FROM journal_entry_types jet
      LEFT JOIN users u ON jet.created_by = u.id
      ORDER BY jet.name ASC
    `;
        const [rows] = await db.query(query);
        return rows;
    },

    // Get journal entry type by ID
    getById: async (id) => {
        const query = `
      SELECT 
        jet.*,
        u.user_name as created_by_name
      FROM journal_entry_types jet
      LEFT JOIN users u ON jet.created_by = u.id
      WHERE jet.id = ?
    `;
        const [rows] = await db.query(query, [id]);
        return rows[0] || null;
    },

    // Check if user has access to a journal entry type
    checkUserAccess: async (userId, entryTypeId) => {
        const query = `
      SELECT COUNT(*) as has_access
      FROM journal_entry_type_permissions
      WHERE user_id = ? AND entry_type_id = ?
    `;
        const [rows] = await db.query(query, [userId, entryTypeId]);
        return rows[0].has_access > 0;
    },

    // Get users who have access to a journal entry type
    getUsersByType: async (entryTypeId) => {
        const query = `
      SELECT 
        u.id,
        u.user_name,
        u.email
      FROM users u
      INNER JOIN journal_entry_type_permissions jetp ON u.id = jetp.user_id
      WHERE jetp.entry_type_id = ?
      ORDER BY u.user_name ASC
    `;
        const [rows] = await db.query(query, [entryTypeId]);
        return rows;
    },

    // Update journal entry type
    update: async (id, typeData) => {
        const { name, description } = typeData;
        const updateKeys = [];
        const updateValues = [];

        if (name !== undefined) {
            updateKeys.push('name = ?');
            updateValues.push(name);
        }
        if (description !== undefined) {
            updateKeys.push('description = ?');
            updateValues.push(description || null);
        }

        if (updateKeys.length === 0) {
            return await JournalEntryTypeModel.getById(id);
        }

        updateValues.push(id);
        const query = `UPDATE journal_entry_types SET ${updateKeys.join(', ')} WHERE id = ?`;
        const [result] = await db.query(query, updateValues);

        if (result.affectedRows === 0) {
            return null;
        }

        return await JournalEntryTypeModel.getById(id);
    },

    // Add users to journal entry type
    addUsers: async (entryTypeId, userIds) => {
        if (!userIds || userIds.length === 0) return true;

        const query = 'INSERT IGNORE INTO journal_entry_type_permissions (entry_type_id, user_id) VALUES ?';
        const values = userIds.map(userId => [entryTypeId, userId]);
        await db.query(query, [values]);
        return true;
    },

    // Remove users from journal entry type
    removeUsers: async (entryTypeId, userIds) => {
        if (!userIds || userIds.length === 0) return true;

        const query = 'DELETE FROM journal_entry_type_permissions WHERE entry_type_id = ? AND user_id IN (?)';
        await db.query(query, [entryTypeId, userIds]);
        return true;
    },

    // Delete journal entry type
    delete: async (id) => {
        // Check if there are any entries using this type
        const [entries] = await db.query('SELECT COUNT(*) as count FROM journal_entries WHERE entry_type_id = ?', [id]);
        if (entries[0].count > 0) {
            throw new Error('Cannot delete journal entry type with existing entries');
        }

        const query = 'DELETE FROM journal_entry_types WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    }
};

module.exports = JournalEntryTypeModel;
