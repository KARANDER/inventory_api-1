const JournalEntryTypeModel = require('../model/journal_entry_type_model');
const { logUserActivity } = require('../utils/activityLogger');

const journalEntryTypeController = {
    // Create new journal entry type
    create: async (req, res) => {
        try {
            const { name, description, user_ids } = req.body;
            const created_by = req.user?.id;

            // Validation
            if (!name || !name.trim()) {
                return res.status(400).json({ success: false, message: 'Journal entry type name is required' });
            }

            if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
                return res.status(400).json({ success: false, message: 'At least one user must have access to this journal entry type' });
            }

            const typeData = {
                name: name.trim(),
                description: description?.trim() || null,
                created_by,
                user_ids
            };

            const newType = await JournalEntryTypeModel.create(typeData);

            await logUserActivity(req, {
                model_name: 'journal_entry_types',
                action_type: 'CREATE',
                record_id: newType.id,
                description: `Created journal entry type: ${name}`
            });

            res.status(201).json({
                success: true,
                message: 'Journal entry type created successfully',
                data: newType
            });
        } catch (error) {
            console.error('Error in create journal entry type:', error);

            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'A journal entry type with this name already exists'
                });
            }

            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    // Get all journal entry types accessible by current user
    getMyTypes: async (req, res) => {
        try {
            const userId = req.user?.id;
            const types = await JournalEntryTypeModel.getAllByUser(userId);
            res.status(200).json({ success: true, data: types });
        } catch (error) {
            console.error('Error in getMyTypes:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    // Get all journal entry types (admin)
    getAll: async (req, res) => {
        try {
            const types = await JournalEntryTypeModel.getAll();
            res.status(200).json({ success: true, data: types });
        } catch (error) {
            console.error('Error in getAll journal entry types:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    // Get journal entry type by ID
    getById: async (req, res) => {
        try {
            const { id } = req.body;
            const userId = req.user?.id;

            if (!id) {
                return res.status(400).json({ success: false, message: 'Journal entry type ID is required' });
            }

            // Check if user has access
            const hasAccess = await JournalEntryTypeModel.checkUserAccess(userId, id);
            if (!hasAccess) {
                return res.status(403).json({ success: false, message: 'You do not have access to this journal entry type' });
            }

            const type = await JournalEntryTypeModel.getById(id);

            if (!type) {
                return res.status(404).json({ success: false, message: 'Journal entry type not found' });
            }

            // Get users who have access
            const users = await JournalEntryTypeModel.getUsersByType(id);
            type.users = users;

            res.status(200).json({ success: true, data: type });
        } catch (error) {
            console.error('Error in getById journal entry type:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    // Update journal entry type
    update: async (req, res) => {
        try {
            const { id, name, description } = req.body;
            const userId = req.user?.id;

            if (!id) {
                return res.status(400).json({ success: false, message: 'Journal entry type ID is required' });
            }

            // Check if user has access
            const hasAccess = await JournalEntryTypeModel.checkUserAccess(userId, id);
            if (!hasAccess) {
                return res.status(403).json({ success: false, message: 'You do not have access to this journal entry type' });
            }

            const updateData = {};
            if (name !== undefined) updateData.name = name.trim();
            if (description !== undefined) updateData.description = description?.trim() || null;

            const updatedType = await JournalEntryTypeModel.update(id, updateData);

            if (!updatedType) {
                return res.status(404).json({ success: false, message: 'Journal entry type not found' });
            }

            await logUserActivity(req, {
                model_name: 'journal_entry_types',
                action_type: 'UPDATE',
                record_id: id,
                description: 'Updated journal entry type'
            });

            res.status(200).json({
                success: true,
                message: 'Journal entry type updated successfully',
                data: updatedType
            });
        } catch (error) {
            console.error('Error in update journal entry type:', error);

            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'A journal entry type with this name already exists'
                });
            }

            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    // Add users to journal entry type
    addUsers: async (req, res) => {
        try {
            const { id, user_ids } = req.body;
            const userId = req.user?.id;

            if (!id) {
                return res.status(400).json({ success: false, message: 'Journal entry type ID is required' });
            }

            if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
                return res.status(400).json({ success: false, message: 'User IDs are required' });
            }

            // Check if user has access
            const hasAccess = await JournalEntryTypeModel.checkUserAccess(userId, id);
            if (!hasAccess) {
                return res.status(403).json({ success: false, message: 'You do not have access to this journal entry type' });
            }

            await JournalEntryTypeModel.addUsers(id, user_ids);

            await logUserActivity(req, {
                model_name: 'journal_entry_types',
                action_type: 'UPDATE',
                record_id: id,
                description: `Added ${user_ids.length} user(s) to journal entry type`
            });

            res.status(200).json({
                success: true,
                message: 'Users added successfully'
            });
        } catch (error) {
            console.error('Error in addUsers:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    // Remove users from journal entry type
    removeUsers: async (req, res) => {
        try {
            const { id, user_ids } = req.body;
            const userId = req.user?.id;

            if (!id) {
                return res.status(400).json({ success: false, message: 'Journal entry type ID is required' });
            }

            if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
                return res.status(400).json({ success: false, message: 'User IDs are required' });
            }

            // Check if user has access
            const hasAccess = await JournalEntryTypeModel.checkUserAccess(userId, id);
            if (!hasAccess) {
                return res.status(403).json({ success: false, message: 'You do not have access to this journal entry type' });
            }

            await JournalEntryTypeModel.removeUsers(id, user_ids);

            await logUserActivity(req, {
                model_name: 'journal_entry_types',
                action_type: 'UPDATE',
                record_id: id,
                description: `Removed ${user_ids.length} user(s) from journal entry type`
            });

            res.status(200).json({
                success: true,
                message: 'Users removed successfully'
            });
        } catch (error) {
            console.error('Error in removeUsers:', error);
            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    },

    // Delete journal entry type
    delete: async (req, res) => {
        try {
            const { id } = req.body;
            const userId = req.user?.id;

            if (!id) {
                return res.status(400).json({ success: false, message: 'Journal entry type ID is required' });
            }

            // Check if user has access
            const hasAccess = await JournalEntryTypeModel.checkUserAccess(userId, id);
            if (!hasAccess) {
                return res.status(403).json({ success: false, message: 'You do not have access to this journal entry type' });
            }

            const deleted = await JournalEntryTypeModel.delete(id);

            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Journal entry type not found' });
            }

            await logUserActivity(req, {
                model_name: 'journal_entry_types',
                action_type: 'DELETE',
                record_id: id,
                description: 'Deleted journal entry type'
            });

            res.status(200).json({ success: true, message: 'Journal entry type deleted successfully' });
        } catch (error) {
            console.error('Error in delete journal entry type:', error);

            if (error.message.includes('existing entries')) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete journal entry type that has existing entries'
                });
            }

            res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        }
    }
};

module.exports = journalEntryTypeController;
