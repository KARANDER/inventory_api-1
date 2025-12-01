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
  }
};

module.exports = userActivityController;

