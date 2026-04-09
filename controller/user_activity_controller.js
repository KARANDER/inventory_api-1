const UserActivity = require('../model/user_activity_model');

const userActivityController = {
  getHistory: async (req, res) => {
    try {
      const { user_id, model_name, action_type, start_date, end_date, limit, offset } = req.body;

      const filters = {
        user_id,
        model_name,
        action_type,
        start_date,
        end_date,
        limit: limit || 100,
        offset: offset || 0
      };

      const history = await UserActivity.findAll(filters);

      res.status(200).json({
        success: true,
        data: history,
        count: history.length
      });
    } catch (error) {
      console.error('Get User Activity History Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  batchDeleteHistory: async (req, res) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Request body must contain ids array.'
        });
      }

      const normalizedIds = [...new Set(
        ids
          .map(id => parseInt(id, 10))
          .filter(id => Number.isInteger(id) && id > 0)
      )];

      if (normalizedIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'ids must contain valid positive integers.'
        });
      }

      const result = await UserActivity.batchDeleteByIds(normalizedIds);
      const failed = result.notFoundIds.map(id => ({
        id,
        message: 'History record not found'
      }));

      res.status(200).json({
        success: true,
        deletedCount: result.deletedCount,
        failed
      });
    } catch (error) {
      console.error('Batch Delete User Activity History Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }
};

module.exports = userActivityController;

