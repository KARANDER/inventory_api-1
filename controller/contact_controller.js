const Contact = require('../model/contact_model');
const { logUserActivity } = require('../utils/activityLogger');

const contactController = {
  createContact: async (req, res) => {
    try {
      const created_by = req.user.id;
      
      // The file path will be available in req.file.path
      const image_url = req.file ? req.file.path : null;

      // The rest of the form data is in req.body
      const contactData = {
        ...req.body,
        details: typeof req.body.details === 'string' ? JSON.parse(req.body.details) : req.body.details, // The details object will be a string, so we parse it
        image_url: image_url, // Add the image path
        created_by: created_by
      };

      const newContact = await Contact.create(contactData);
      await logUserActivity(req, {
        model_name: 'contacts',
        action_type: 'CREATE',
        record_id: newContact.id,
        description: 'Created contact'
      });
      res.status(201).json({ success: true, data: newContact });
    } catch (error) {
      console.error("Create Contact Error:", error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  // ... (getAllContacts remains the same)
  getAllContacts: async (req, res) => {
    try {
      const contacts = await Contact.findAll();
      res.status(200).json({ success: true, data: contacts });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  updateContact: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Contact ID is required.' });
      }

      // Parse details JSON if present
      if (typeof req.body.details === 'string') {
        req.body.details = JSON.parse(req.body.details);
      }

      // Include user id from auth
      req.body.updated_by = req.user.id;

      const updatedContact = await Contact.update(id, req.body);

      await logUserActivity(req, {
        model_name: 'contacts',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated contact'
      });
      res.status(200).json({ success: true, message: 'Contact updated successfully.', data: updatedContact });
    } catch (error) {
      console.error('Update Contact Error:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  deleteContact: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Contact ID is required.' });
      }

      await Contact.delete(id);

      await logUserActivity(req, {
        model_name: 'contacts',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted contact'
      });
      res.status(200).json({ success: true, message: 'Contact deleted successfully.' });
    } catch (error) {
      console.error('Delete Contact Error:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getAllContactCodes: async (req, res) => {
    try {
        const contactCodes = await Contact.findAllContactCodes();
        res.status(200).json({
            success: true,
            data: contactCodes.map(row => row.code)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
},

};

module.exports = contactController;