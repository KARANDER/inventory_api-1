const SalesLock = require('../model/sales_lock_model');
const { logUserActivity } = require('../utils/activityLogger');

// Get current lock status
exports.getStatus = async (req, res) => {
    try {
        const status = await SalesLock.getStatus();

        res.status(200).json({
            success: true,
            data: {
                is_locked: status.is_locked,
                locked_by: status.locked_by,
                locked_at: status.locked_at,
                unlocked_at: status.unlocked_at
            }
        });
    } catch (error) {
        console.error('Error getting sales lock status:', error);
        res.status(500).json({
            success: false,
            message: 'Server error.',
            error: error.message
        });
    }
};

// Toggle lock ON/OFF
exports.toggleLock = async (req, res) => {
    try {
        const { is_locked } = req.body;
        const userId = req.user.id;

        if (typeof is_locked !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'is_locked must be true or false.'
            });
        }

        const updatedStatus = await SalesLock.toggleLock(userId, is_locked);

        // Log activity
        await logUserActivity(req, {
            model_name: 'sales_lock',
            action_type: 'UPDATE',
            record_id: updatedStatus.id,
            description: `${is_locked ? 'Locked' : 'Unlocked'} sales operations`
        });

        res.status(200).json({
            success: true,
            message: `Sales operations ${is_locked ? 'locked' : 'unlocked'} successfully.`,
            data: {
                is_locked: updatedStatus.is_locked,
                locked_by: updatedStatus.locked_by,
                locked_at: updatedStatus.locked_at,
                unlocked_at: updatedStatus.unlocked_at
            }
        });
    } catch (error) {
        console.error('Error toggling sales lock:', error);
        res.status(500).json({
            success: false,
            message: 'Server error.',
            error: error.message
        });
    }
};
