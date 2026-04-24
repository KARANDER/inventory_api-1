const SalesLock = require('../model/sales_lock_model');
const { logUserActivity } = require('../utils/activityLogger');
const db = require('../config/db');

const salesLockController = {
    // Get all module lock statuses
    getAllStatuses: async (req, res) => {
        try {
            const statuses = await SalesLock.getAllStatuses();

            res.status(200).json({
                success: true,
                data: statuses
            });
        } catch (error) {
            console.error('Error getting all lock statuses:', error);
            res.status(500).json({
                success: false,
                message: 'Server error.',
                error: error.message
            });
        }
    },

    // Get lock status for a specific module
    getStatus: async (req, res) => {
        try {
            const { module_name } = req.body;
            const moduleName = module_name || 'all';

            const status = await SalesLock.getStatus(moduleName);

            res.status(200).json({
                success: true,
                data: status
            });
        } catch (error) {
            console.error('Error getting lock status:', error);
            res.status(500).json({
                success: false,
                message: 'Server error.',
                error: error.message
            });
        }
    },

    // Toggle lock ON/OFF for a specific module
    toggleLock: async (req, res) => {
        try {
            const { module_name, is_locked } = req.body;
            const userId = req.user.id;

            if (!module_name) {
                return res.status(400).json({
                    success: false,
                    message: 'module_name is required.'
                });
            }

            if (typeof is_locked !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'is_locked must be true or false.'
                });
            }

            // Special handling for "all" - lock/unlock ALL modules
            if (module_name === 'all') {
                // Update ALL modules including "all" itself
                const query = `
          UPDATE sales_lock 
          SET is_locked = ?, 
              locked_by = ?, 
              ${is_locked ? 'locked_at = NOW()' : 'unlocked_at = NOW()'}
        `;
                await db.query(query, [is_locked, userId]);

                // Log activity
                await logUserActivity(req, {
                    model_name: 'sales_lock',
                    action_type: 'UPDATE',
                    record_id: null,
                    description: `${is_locked ? 'Locked' : 'Unlocked'} all modules`
                });

                // Return all updated statuses
                const allStatuses = await SalesLock.getAllStatuses();

                return res.status(200).json({
                    success: true,
                    message: `All modules ${is_locked ? 'locked' : 'unlocked'} successfully.`,
                    data: allStatuses
                });
            }

            // Normal single module toggle
            const updatedStatus = await SalesLock.toggleLock(userId, module_name, is_locked);

            // Log activity
            await logUserActivity(req, {
                model_name: 'sales_lock',
                action_type: 'UPDATE',
                record_id: updatedStatus.id,
                description: `${is_locked ? 'Locked' : 'Unlocked'} ${module_name} module`
            });

            res.status(200).json({
                success: true,
                message: `${updatedStatus.display_name || module_name} ${is_locked ? 'locked' : 'unlocked'} successfully.`,
                data: updatedStatus
            });
        } catch (error) {
            console.error('Error toggling lock:', error);
            res.status(500).json({
                success: false,
                message: 'Server error.',
                error: error.message
            });
        }
    }
};

module.exports = salesLockController;
