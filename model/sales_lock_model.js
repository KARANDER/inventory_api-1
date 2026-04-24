const db = require('../config/db');

const SalesLock = {
    // Get current lock status
    getStatus: async () => {
        const query = 'SELECT * FROM sales_lock ORDER BY id DESC LIMIT 1';
        const [rows] = await db.query(query);
        return rows[0] || { is_locked: false };
    },

    // Toggle lock status
    toggleLock: async (userId, isLocked) => {
        const status = await SalesLock.getStatus();

        if (status.id) {
            // Update existing record
            const query = `
        UPDATE sales_lock 
        SET is_locked = ?, 
            locked_by = ?, 
            ${isLocked ? 'locked_at = NOW()' : 'unlocked_at = NOW()'}
        WHERE id = ?
      `;
            await db.query(query, [isLocked, userId, status.id]);
        } else {
            // Insert new record if none exists
            const query = `
        INSERT INTO sales_lock (is_locked, locked_by, ${isLocked ? 'locked_at' : 'unlocked_at'}) 
        VALUES (?, ?, NOW())
      `;
            await db.query(query, [isLocked, userId]);
        }

        return await SalesLock.getStatus();
    },

    // Check if sales operations are locked
    isLocked: async () => {
        const status = await SalesLock.getStatus();
        return status.is_locked === true || status.is_locked === 1;
    }
};

module.exports = SalesLock;
