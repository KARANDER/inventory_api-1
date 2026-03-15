const Database = require('../model/database_model');
const { logUserActivity } = require('../utils/activityLogger');

const databaseController = {
    // Delete all data from the entire database
    deleteAllData: async (req, res) => {
        try {
            const result = await Database.deleteAllData();

            await logUserActivity(req, {
                model_name: 'database',
                action_type: 'DELETE',
                description: 'Deleted all database data'
            });

            res.status(200).json({
                success: true,
                message: 'Successfully deleted all database data',
                deletedTables: result.deletedTables,
                summary: result.summary
            });
        } catch (error) {
            console.error('Delete All Data Error:', error);
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    }
};

module.exports = databaseController;
