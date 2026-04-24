const db = require('../config/db');

const SalesLock = {
    // Get all module lock statuses
    getAllStatuses: async () => {
        const query = 'SELECT * FROM sales_lock ORDER BY module_name ASC';
        const [rows] = await db.query(query);
        return rows;
    },

    // Get lock status for a specific module
    getStatus: async (moduleName = 'all') => {
        const query = 'SELECT * FROM sales_lock WHERE module_name = ? LIMIT 1';
        const [rows] = await db.query(query, [moduleName]);
        return rows[0] || { module_name: moduleName, is_locked: false };
    },

    // Toggle lock status for a specific module
    toggleLock: async (userId, moduleName, isLocked) => {
        // Check if module exists
        const existing = await SalesLock.getStatus(moduleName);

        if (existing.id) {
            // Update existing record
            const query = `
        UPDATE sales_lock 
        SET is_locked = ?, 
            locked_by = ?, 
            ${isLocked ? 'locked_at = NOW()' : 'unlocked_at = NOW()'}
        WHERE module_name = ?
      `;
            await db.query(query, [isLocked, userId, moduleName]);
        } else {
            // Insert new record if none exists
            const query = `
        INSERT INTO sales_lock (module_name, is_locked, locked_by, ${isLocked ? 'locked_at' : 'unlocked_at'}) 
        VALUES (?, ?, ?, NOW())
      `;
            await db.query(query, [moduleName, isLocked, userId]);
        }

        return await SalesLock.getStatus(moduleName);
    },

    // Check if a specific module is locked
    isLocked: async (moduleName) => {
        // First check if 'all' is locked
        const allStatus = await SalesLock.getStatus('all');
        if (allStatus.is_locked === true || allStatus.is_locked === 1) {
            return true;
        }

        // Then check specific module
        const status = await SalesLock.getStatus(moduleName);
        return status.is_locked === true || status.is_locked === 1;
    }
};

module.exports = SalesLock;
