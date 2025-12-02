const UserActivity = require('../model/user_activity_model');

/**
 * Helper to log user actions into user_activity table.
 *
 * Usage:
 *   await logUserActivity(req, {
 *     model_name: 'accounts',
 *     action_type: 'CREATE', // 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
 *     record_id: newId,
 *     description: 'Created account ABC',
 *     changes: { field1: { old: 'value1', new: 'value2' } } // Optional: for UPDATE actions
 *   });
 */
const logUserActivity = async (req, { model_name, action_type, record_id, description, changes }) => {
  try {
    const user = req.user;
    if (!user || !user.id || !user.name) return;

    await UserActivity.log({
      user_id: user.id,
      user_name: user.name,
      model_name,
      action_type,
      record_id,
      description,
      changes,
    });
  } catch (err) {
    // Do not break main flow if logging fails
    console.error('User activity log error:', err.message || err);
  }
};

module.exports = { logUserActivity };


