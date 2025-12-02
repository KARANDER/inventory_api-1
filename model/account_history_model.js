const db = require('../config/db');

const AccountHistory = {
  // Create a new account history record
  create: async (historyData) => {
    const {
      account_id,
      transaction_type,
      amount,
      contact_id,
      contact_name,
      contact_type,
      date,
      description,
      reference,
      receipt_id,
      payment_id,
      balance_after,
      user_id
    } = historyData;

    const query = `
      INSERT INTO account_history 
      (account_id, transaction_type, amount, contact_id, contact_name, contact_type, 
       date, description, reference, receipt_id, payment_id, balance_after, user_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      account_id,
      transaction_type,
      amount,
      contact_id || null,
      contact_name || null,
      contact_type || null,
      date,
      description || null,
      reference || null,
      receipt_id || null,
      payment_id || null,
      balance_after || null,
      user_id || null
    ];

    const [result] = await db.query(query, values);
    return { id: result.insertId, ...historyData };
  },

  // Get all history for a specific account
  findByAccountId: async (accountId, filters = {}) => {
    let query = `
      SELECT 
        ah.*,
        a.account_name,
        a.code as account_code,
        c.name as contact_full_name,
        c.code as contact_code
      FROM account_history ah
      LEFT JOIN accounts a ON ah.account_id = a.id
      LEFT JOIN contacts c ON ah.contact_id = c.id
      WHERE ah.account_id = ?
    `;

    const values = [accountId];

    // Add date range filter
    if (filters.start_date) {
      query += ' AND ah.date >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND ah.date <= ?';
      values.push(filters.end_date);
    }

    // Add transaction type filter
    if (filters.transaction_type) {
      query += ' AND ah.transaction_type = ?';
      values.push(filters.transaction_type);
    }

    // Add contact filter
    if (filters.contact_id) {
      query += ' AND ah.contact_id = ?';
      values.push(filters.contact_id);
    }

    // Order by date (newest first)
    query += ' ORDER BY ah.date DESC, ah.created_at DESC';

    // Add pagination
    if (filters.limit) {
      query += ' LIMIT ?';
      values.push(parseInt(filters.limit));
      
      if (filters.offset) {
        query += ' OFFSET ?';
        values.push(parseInt(filters.offset));
      }
    }

    const [rows] = await db.query(query, values);
    return rows;
  },

  // Get all account history (across all accounts)
  findAll: async (filters = {}) => {
    let query = `
      SELECT 
        ah.*,
        a.account_name,
        a.code as account_code,
        c.name as contact_full_name,
        c.code as contact_code
      FROM account_history ah
      LEFT JOIN accounts a ON ah.account_id = a.id
      LEFT JOIN contacts c ON ah.contact_id = c.id
      WHERE 1=1
    `;

    const values = [];

    // Add account filter
    if (filters.account_id) {
      query += ' AND ah.account_id = ?';
      values.push(filters.account_id);
    }

    // Add date range filter
    if (filters.start_date) {
      query += ' AND ah.date >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND ah.date <= ?';
      values.push(filters.end_date);
    }

    // Add transaction type filter
    if (filters.transaction_type) {
      query += ' AND ah.transaction_type = ?';
      values.push(filters.transaction_type);
    }

    // Add contact filter
    if (filters.contact_id) {
      query += ' AND ah.contact_id = ?';
      values.push(filters.contact_id);
    }

    // Order by date (newest first)
    query += ' ORDER BY ah.date DESC, ah.created_at DESC';

    // Add pagination
    if (filters.limit) {
      query += ' LIMIT ?';
      values.push(parseInt(filters.limit));
      
      if (filters.offset) {
        query += ' OFFSET ?';
        values.push(parseInt(filters.offset));
      }
    }

    const [rows] = await db.query(query, values);
    return rows;
  },

  // Get account history summary (total credit, debit, balance)
  getAccountSummary: async (accountId, filters = {}) => {
    let query = `
      SELECT 
        account_id,
        SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END) as total_credit,
        SUM(CASE WHEN transaction_type = 'DEBIT' THEN amount ELSE 0 END) as total_debit,
        COUNT(*) as total_transactions,
        MIN(date) as first_transaction_date,
        MAX(date) as last_transaction_date
      FROM account_history
      WHERE account_id = ?
    `;

    const values = [accountId];

    // Add date range filter
    if (filters.start_date) {
      query += ' AND date >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND date <= ?';
      values.push(filters.end_date);
    }

    const [rows] = await db.query(query, values);
    return rows[0] || null;
  },

  // Get current account balance (from accounts table)
  getCurrentBalance: async (accountId) => {
    const [rows] = await db.query('SELECT balance FROM accounts WHERE id = ?', [accountId]);
    return rows[0]?.balance || 0;
  },

  // Get account history by account name (e.g., "NO_1")
  findByAccountName: async (accountName, filters = {}) => {
    let query = `
      SELECT 
        ah.id,
        ah.transaction_type,
        ah.amount,
        ah.date,
        ah.description,
        ah.reference,
        ah.balance_after,
        a.account_name,
        a.code as account_code,
        CASE 
          WHEN ah.transaction_type = 'CREDIT' THEN ah.contact_name
          ELSE NULL
        END as customer_name,
        CASE 
          WHEN ah.transaction_type = 'DEBIT' THEN ah.contact_name
          ELSE NULL
        END as supplier_name,
        ah.contact_id,
        ah.contact_type
      FROM account_history ah
      LEFT JOIN accounts a ON ah.account_id = a.id
      WHERE a.account_name = ?
    `;

    const values = [accountName];

    // Add date range filter
    if (filters.start_date) {
      query += ' AND ah.date >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND ah.date <= ?';
      values.push(filters.end_date);
    }

    // Add transaction type filter
    if (filters.transaction_type) {
      query += ' AND ah.transaction_type = ?';
      values.push(filters.transaction_type);
    }

    // Order by date (newest first)
    query += ' ORDER BY ah.date DESC, ah.created_at DESC';

    // Add pagination
    if (filters.limit) {
      query += ' LIMIT ?';
      values.push(parseInt(filters.limit));
      
      if (filters.offset) {
        query += ' OFFSET ?';
        values.push(parseInt(filters.offset));
      }
    }

    const [rows] = await db.query(query, values);
    return rows;
  },

  // Get account summary by account name
  getAccountSummaryByName: async (accountName, filters = {}) => {
    let query = `
      SELECT 
        a.account_name,
        a.id as account_id,
        SUM(CASE WHEN ah.transaction_type = 'CREDIT' THEN ah.amount ELSE 0 END) as total_credit,
        SUM(CASE WHEN ah.transaction_type = 'DEBIT' THEN ah.amount ELSE 0 END) as total_debit,
        COUNT(*) as total_transactions,
        MIN(ah.date) as first_transaction_date,
        MAX(ah.date) as last_transaction_date
      FROM account_history ah
      INNER JOIN accounts a ON ah.account_id = a.id
      WHERE a.account_name = ?
    `;

    const values = [accountName];

    // Add date range filter
    if (filters.start_date) {
      query += ' AND ah.date >= ?';
      values.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND ah.date <= ?';
      values.push(filters.end_date);
    }

    const [rows] = await db.query(query, values);
    return rows[0] || null;
  },

  // Delete history record (usually when receipt/payment is deleted)
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM account_history WHERE id = ?', [id]);
    return result.affectedRows;
  },

  // Delete by receipt_id
  deleteByReceiptId: async (receiptId) => {
    const [result] = await db.query('DELETE FROM account_history WHERE receipt_id = ?', [receiptId]);
    return result.affectedRows;
  },

  // Delete by payment_id
  deleteByPaymentId: async (paymentId) => {
    const [result] = await db.query('DELETE FROM account_history WHERE payment_id = ?', [paymentId]);
    return result.affectedRows;
  }
};

module.exports = AccountHistory;

