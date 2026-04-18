const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const query = `
      SELECT id, user_name, email
      FROM users 
      WHERE id = ?
    `;
    const [rows] = await db.query(query, [id]);
    if (rows[0]) {
      const permissions = await User.findPermissionsByUserId(id);
      rows[0].permissions = permissions;
    }
    return rows[0];
  },

  getAll: async () => {
    const query = `
      SELECT id, user_name, email
      FROM users 
      ORDER BY user_name ASC
    `;
    const [rows] = await db.query(query);

    // Get permissions for each user
    for (let user of rows) {
      user.permissions = await User.findPermissionsByUserId(user.id);
    }

    return rows;
  },

  // --- MODIFIED create function ---
  create: async (userData) => {
    const { user_name, email, password, permissions } = userData;
    const connection = await db.getConnection();

    try {
      // Start a transaction
      await connection.beginTransaction();

      // 1. Create the user
      const hashedPassword = await bcrypt.hash(password, 10);
      const userQuery = 'INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)';
      const [result] = await connection.query(userQuery, [user_name, email, hashedPassword]);
      const userId = result.insertId;

      // 2. Insert permissions if they exist
      if (permissions && permissions.length > 0) {
        const permissionQuery = 'INSERT INTO user_permissions (user_id, permission_name) VALUES ?';
        // Format data for bulk insert: [[userId, 'receipts'], [userId, 'payments']]
        const permissionValues = permissions.map(p => [userId, p]);
        await connection.query(permissionQuery, [permissionValues]);
      }

      // If everything is successful, commit the transaction
      await connection.commit();

      // Return full user data with permissions
      return await User.findById(userId);

    } catch (error) {
      await connection.rollback();
      throw error; // Let the controller handle the error
    } finally {
      connection.release();
    }
  },

  update: async (id, userData) => {
    const { user_name, email, password, permissions } = userData;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Update user basic info
      const updateKeys = [];
      const updateValues = [];

      if (user_name !== undefined) {
        updateKeys.push('user_name = ?');
        updateValues.push(user_name);
      }
      if (email !== undefined) {
        updateKeys.push('email = ?');
        updateValues.push(email);
      }
      if (password !== undefined) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateKeys.push('password = ?');
        updateValues.push(hashedPassword);
      }

      if (updateKeys.length > 0) {
        updateValues.push(id);
        const query = `UPDATE users SET ${updateKeys.join(', ')} WHERE id = ?`;
        await connection.query(query, updateValues);
      }

      // 2. Update permissions if provided
      if (permissions !== undefined) {
        // Delete existing permissions
        await connection.query('DELETE FROM user_permissions WHERE user_id = ?', [id]);

        // Insert new permissions
        if (permissions.length > 0) {
          const permissionQuery = 'INSERT INTO user_permissions (user_id, permission_name) VALUES ?';
          const permissionValues = permissions.map(p => [id, p]);
          await connection.query(permissionQuery, [permissionValues]);
        }
      }

      await connection.commit();
      return await User.findById(id);

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  delete: async (id) => {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  },

  // --- NEW function to get permissions ---
  findPermissionsByUserId: async (userId) => {
    const query = 'SELECT permission_name FROM user_permissions WHERE user_id = ?';
    const [rows] = await db.query(query, [userId]);
    // Return an array of strings, e.g., ['receipts', 'payments']
    return rows.map(row => row.permission_name);
  }
};

module.exports = User;