const User = require('../model/user_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { logUserActivity } = require('../utils/activityLogger');

const userController = {
  // Get all users
  getAll: async (req, res) => {
    try {
      const users = await User.getAll();
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Error in getAll users:', error);
      res.status(500).json({
        success: false,
        message: 'Server error.',
        error: error.message
      });
    }
  },

  // Get user by ID
  getById: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required.'
        });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error in getById user:', error);
      res.status(500).json({
        success: false,
        message: 'Server error.',
        error: error.message
      });
    }
  },

  // --- MODIFIED register function ---
  register: async (req, res) => {
    try {
      // 'permissions' is now expected in the body, e.g., ["receipts", "payments"]
      const { user_name, email, password, permissions } = req.body;

      if (!user_name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, and password are required.'
        });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }

      // Pass permissions to the create function
      const newUser = await User.create({ user_name, email, password, permissions });

      // Log user creation (if req.user exists, otherwise use created user's info)
      if (req.user) {
        await logUserActivity(req, {
          model_name: 'users',
          action_type: 'CREATE',
          record_id: newUser.id,
          description: `Created user ${user_name}`
        });
      }

      // No token is generated on creation anymore, as an admin is creating the user.
      res.status(201).json({
        success: true,
        message: 'User created successfully.',
        data: newUser
      });

    } catch (error) {
      console.error('Registration Error:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error during registration.',
        error: error.message
      });
    }
  },

  // Update user
  update: async (req, res) => {
    try {
      const { id, user_name, email, password, permissions } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required.'
        });
      }

      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      const updateData = {};
      if (user_name !== undefined) updateData.user_name = user_name;
      if (email !== undefined) updateData.email = email;
      if (password !== undefined) updateData.password = password;
      if (permissions !== undefined) updateData.permissions = permissions;

      const updatedUser = await User.update(id, updateData);

      await logUserActivity(req, {
        model_name: 'users',
        action_type: 'UPDATE',
        record_id: id,
        description: `Updated user ${updatedUser.user_name}`
      });

      res.status(200).json({
        success: true,
        message: 'User updated successfully.',
        data: updatedUser
      });

    } catch (error) {
      console.error('Update Error:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error during update.',
        error: error.message
      });
    }
  },

  // Delete user
  delete: async (req, res) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required.'
        });
      }

      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      const deleted = await User.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      await logUserActivity(req, {
        model_name: 'users',
        action_type: 'DELETE',
        record_id: id,
        description: `Deleted user ${existingUser.user_name}`
      });

      res.status(200).json({
        success: true,
        message: 'User deleted successfully.'
      });

    } catch (error) {
      console.error('Delete Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during deletion.',
        error: error.message
      });
    }
  },

  // --- MODIFIED login function ---
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      // --- Fetch permissions and add them to the token ---
      const permissions = await User.findPermissionsByUserId(user.id);

      const payload = {
        id: user.id,
        email: user.email,
        name: user.user_name,
        permissions: permissions // Embed permissions in the token
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
      );

      // Log login activity (create a temporary req object for logging)
      const tempReq = { user: { id: user.id, name: user.user_name } };
      await logUserActivity(tempReq, {
        model_name: 'users',
        action_type: 'LOGIN',
        record_id: user.id,
        description: `User ${user.user_name} logged in`
      });

      res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token: token
      });

    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login.',
        error: error.message
      });
    }
  }
};

module.exports = userController;