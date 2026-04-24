const Payment = require('../model/payment_model');
const { logUserActivity } = require('../utils/activityLogger');
const SalesLock = require('../model/sales_lock_model');

const paymentController = {
  createPayment: async (req, res) => {
    try {
      // Check if payments module is locked
      const isLocked = await SalesLock.isLocked('payments');
      if (isLocked) {
        return res.status(403).json({
          success: false,
          message: 'Payments are currently locked. Cannot create payments.'
        });
      }

      const user_id = req.user.id;
      const image_url = req.file ? req.file.path : null;

      const paymentData = {
        ...req.body,
        image_url: image_url,
        user_id: user_id
      };

      const newPayment = await Payment.create(paymentData);
      await logUserActivity(req, {
        model_name: 'payments',
        action_type: 'CREATE',
        record_id: newPayment.id,
        description: 'Created payment'
      });
      res.status(201).json({ success: true, message: "Payment created and account balance updated.", data: newPayment });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getAllPayments: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.body;

      const result = await Payment.findAllPaginated({
        page: parseInt(page),
        limit: parseInt(limit),
        search: search || ''
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  updatePayment: async (req, res) => {
    try {
      const paymentId = req.body.id;
      const user_id = req.user.id;
      const image_url = req.file ? req.file.path : null;
      const updateData = { ...req.body, user_id };
      if (image_url) updateData.image_url = image_url;

      const updatedPayment = await Payment.update(paymentId, updateData);
      await logUserActivity(req, {
        model_name: 'payments',
        action_type: 'UPDATE',
        record_id: paymentId,
        description: 'Updated payment'
      });
      res.status(200).json({ success: true, message: "Payment updated successfully.", data: updatedPayment });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  deletePayment: async (req, res) => {
    try {
      const paymentId = req.body.id;
      const affectedRows = await Payment.delete(paymentId);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Payment not found' });
      }
      await logUserActivity(req, {
        model_name: 'payments',
        action_type: 'DELETE',
        record_id: paymentId,
        description: 'Deleted payment'
      });
      res.status(200).json({ success: true, message: "Payment deleted successfully." });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Delete all payments
  deleteAllPayments: async (req, res) => {
    try {
      const result = await Payment.deleteAll();
      await logUserActivity(req, {
        model_name: 'payments',
        action_type: 'DELETE',
        description: `Deleted all payments (${result.deletedCount} records)`
      });
      res.status(200).json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} payments`,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Batch delete multiple payments by IDs
  batchDeletePayments: async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Request body must contain ids array.' });
      }

      let deletedCount = 0;
      const failed = [];

      for (const id of ids) {
        try {
          const affectedRows = await Payment.delete(id);
          if (affectedRows === 0) {
            failed.push({ id, message: 'Payment not found' });
          } else {
            deletedCount++;
            await logUserActivity(req, {
              model_name: 'payments',
              action_type: 'DELETE',
              record_id: id,
              description: 'Deleted payment (batch)'
            });
          }
        } catch (error) {
          failed.push({ id, message: error.message });
        }
      }

      res.status(200).json({ success: true, deletedCount, failed });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  deletePaymentsByContactId: async (req, res) => {
    try {
      const { contact_id } = req.body;
      if (!contact_id) {
        return res.status(400).json({ success: false, message: 'contact_id is required.' });
      }

      const result = await Payment.deleteByContactId(contact_id);
      await logUserActivity(req, {
        model_name: 'payments',
        action_type: 'DELETE',
        description: `Deleted payments by contact_id ${contact_id} (${result.deletedPayments} payments, ${result.deletedPurchaseInvoices} purchase invoices)`
      });

      res.status(200).json({
        success: true,
        message: `Deleted ${result.deletedPayments} payments and ${result.deletedPurchaseInvoices} purchase invoices for contact_id ${contact_id}`,
        contact_id,
        contact_code: result.contactCode,
        deletedCount: result.deletedCount,
        deletedPayments: result.deletedPayments,
        deletedPurchaseInvoices: result.deletedPurchaseInvoices
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  }

};
module.exports = paymentController;
