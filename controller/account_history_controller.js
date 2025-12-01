const AccountHistory = require('../model/account_history_model');
const db = require('../config/db');

const accountHistoryController = {
  // Get account history for a specific account
  getAccountHistory: async (req, res) => {
    try {
      const { account_id, start_date, end_date, transaction_type, contact_id, limit, offset } = req.body;

      if (!account_id) {
        return res.status(400).json({
          success: false,
          message: 'Account ID is required'
        });
      }

      const filters = {
        start_date,
        end_date,
        transaction_type, // 'CREDIT' or 'DEBIT'
        contact_id,
        limit: limit || 100, // Default limit
        offset: offset || 0
      };

      const history = await AccountHistory.findByAccountId(account_id, filters);
      const summary = await AccountHistory.getAccountSummary(account_id, filters);
      const currentBalance = await AccountHistory.getCurrentBalance(account_id);

      res.status(200).json({
        success: true,
        data: {
          history,
          summary: {
            ...summary,
            current_balance: parseFloat(currentBalance),
            net_amount: (summary?.total_credit || 0) - (summary?.total_debit || 0)
          }
        }
      });
    } catch (error) {
      console.error('Get Account History Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  // Get all account history (across all accounts)
  getAllAccountHistory: async (req, res) => {
    try {
      const { account_id, start_date, end_date, transaction_type, contact_id, limit, offset } = req.body;

      const filters = {
        account_id,
        start_date,
        end_date,
        transaction_type,
        contact_id,
        limit: limit || 100,
        offset: offset || 0
      };

      const history = await AccountHistory.findAll(filters);

      res.status(200).json({
        success: true,
        data: history,
        count: history.length
      });
    } catch (error) {
      console.error('Get All Account History Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  // Get account summary with statistics
  getAccountSummary: async (req, res) => {
    try {
      const { account_id, start_date, end_date } = req.body;

      if (!account_id) {
        return res.status(400).json({
          success: false,
          message: 'Account ID is required'
        });
      }

      const filters = { start_date, end_date };
      const summary = await AccountHistory.getAccountSummary(account_id, filters);
      const currentBalance = await AccountHistory.getCurrentBalance(account_id);

      res.status(200).json({
        success: true,
        data: {
          ...summary,
          current_balance: parseFloat(currentBalance),
          net_amount: (summary?.total_credit || 0) - (summary?.total_debit || 0)
        }
      });
    } catch (error) {
      console.error('Get Account Summary Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  // Get account history by account name (e.g., "NO_1")
  getAccountHistoryByName: async (req, res) => {
    try {
      const { account_name, start_date, end_date, transaction_type, limit, offset } = req.body;

      if (!account_name) {
        return res.status(400).json({
          success: false,
          message: 'Account name is required (e.g., "NO_1")'
        });
      }

      const filters = {
        start_date,
        end_date,
        transaction_type, // 'CREDIT' or 'DEBIT'
        limit: limit || 100,
        offset: offset || 0
      };

      const history = await AccountHistory.findByAccountName(account_name, filters);
      const summary = await AccountHistory.getAccountSummaryByName(account_name, filters);
      
      // Get account ID to fetch current balance
      const [accountRows] = await db.query('SELECT id, balance FROM accounts WHERE account_name = ?', [account_name]);
      const accountId = accountRows[0]?.id;
      const currentBalance = accountId ? await AccountHistory.getCurrentBalance(accountId) : 0;

      // Format history to show customer_name for CREDIT and supplier_name for DEBIT
      const formattedHistory = history.map(item => ({
        id: item.id,
        transaction_type: item.transaction_type,
        amount: parseFloat(item.amount),
        date: item.date,
        description: item.description,
        reference: item.reference,
        balance_after: item.balance_after ? parseFloat(item.balance_after) : null,
        // Show customer name for CREDIT (when amount added)
        customer_name: item.transaction_type === 'CREDIT' ? item.customer_name : null,
        // Show supplier name for DEBIT (when amount minus)
        supplier_name: item.transaction_type === 'DEBIT' ? item.supplier_name : null,
        account_name: item.account_name,
        account_code: item.account_code
      }));

      res.status(200).json({
        success: true,
        data: {
          account_name: account_name,
          history: formattedHistory,
          summary: {
            ...summary,
            current_balance: parseFloat(currentBalance),
            net_amount: (summary?.total_credit || 0) - (summary?.total_debit || 0)
          }
        }
      });
    } catch (error) {
      console.error('Get Account History By Name Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }
};

module.exports = accountHistoryController;

