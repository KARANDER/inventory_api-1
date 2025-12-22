const db = require('../config/db');
const Receipt = {
  create: async (receiptData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { date, amount, contact_id, account_id, description, reference, note, image_url, user_id, customer_id } = receiptData;

      // Step 1: Insert the new receipt
      const receiptQuery = 'INSERT INTO receipts (date, amount, contact_id, account_id, description, reference, note, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const [receiptResult] = await connection.query(receiptQuery, [date, amount, contact_id, account_id, description, reference, note, image_url, user_id]);

      // Step 2: Update the bank account balance
      const updateAccountQuery = 'UPDATE accounts SET balance = balance + ? WHERE id = ?';
      await connection.query(updateAccountQuery, [amount, account_id]);

      // Step 2.5: Get updated balance and contact info for account history
      const [accountRows] = await connection.query('SELECT balance FROM accounts WHERE id = ?', [account_id]);
      const balanceAfter = accountRows[0]?.balance || 0;

      // Get contact information if contact_id exists
      let contactName = null;
      let contactType = null;
      if (contact_id) {
        const [contactRows] = await connection.query('SELECT contact_name, type FROM contacts WHERE id = ?', [contact_id]);
        if (contactRows.length > 0) {
          contactName = contactRows[0].contact_name;
          contactType = contactRows[0].type;
        }
      }

      // Step 2.6: Insert account history record (CREDIT - money added)
      const historyQuery = `
      INSERT INTO account_history 
      (account_id, transaction_type, amount, contact_id, contact_name, contact_type, 
       date, description, reference, receipt_id, balance_after, user_id) 
      VALUES (?, 'CREDIT', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
      await connection.query(historyQuery, [
        account_id,
        amount,
        contact_id || null,
        contactName,
        contactType,
        date,
        description || null,
        reference || null,
        receiptResult.insertId,
        balanceAfter,
        user_id || null
      ]);

      // Step 3: Handle customer-related updates (existing logic)
      if (contact_id && amount && amount > 0 && account_id) {
        const [contactRows] = await connection.query(
          'SELECT type FROM contacts WHERE id = ? LIMIT 1',
          [contact_id]
        );

        if (contactRows.length > 0 && contactRows[0].type === 'Customer') {
          // Update customer total_amount
          const updateCustomerTotalQuery = `
          UPDATE customer_details 
          SET total_amount = COALESCE(total_amount, 0) - ? 
          WHERE contact_id = ?
        `;
          await connection.query(updateCustomerTotalQuery, [amount, contact_id]);

          // Get account name to check if it's NO_1 or NO_2
          const [accountRows] = await connection.query(
            'SELECT account_name FROM accounts WHERE id = ? LIMIT 1',
            [account_id]
          );

          if (accountRows.length > 0) {
            const accountName = accountRows[0].account_name;

            if (accountName === 'NO_1') {
              const updateNo1Query = `
              UPDATE customer_details 
              SET no_1 = COALESCE(no_1, 0) - ? 
              WHERE contact_id = ?
            `;
              await connection.query(updateNo1Query, [amount, contact_id]);
            } else if (accountName === 'NO_2') {
              const updateNo2Query = `
              UPDATE customer_details 
              SET no_2 = COALESCE(no_2, 0) - ? 
              WHERE contact_id = ?
            `;
              await connection.query(updateNo2Query, [amount, contact_id]);
            }
          }
        }
      }

      // Step 4: NEW CASCADING PAYMENT LOGIC
      if (customer_id && amount && amount > 0) {
        let remainingAmount = parseFloat(amount);

        // Get all invoices for this customer with remaining_amount > 0, ordered by most recent first
        const [invoices] = await connection.query(
          `SELECT id, remaining_amount 
         FROM invoices 
         WHERE customer_id = ? AND remaining_amount > 0 
         ORDER BY id DESC`,
          [customer_id]
        );

        // Loop through invoices and apply payment cascading
        for (const invoice of invoices) {
          if (remainingAmount <= 0) break;

          const invoiceRemaining = parseFloat(invoice.remaining_amount);

          if (remainingAmount >= invoiceRemaining) {
            // Payment covers this invoice completely
            await connection.query(
              'UPDATE invoices SET remaining_amount = 0 WHERE id = ?',
              [invoice.id]
            );
            remainingAmount -= invoiceRemaining;
          } else {
            // Partial payment on this invoice
            await connection.query(
              'UPDATE invoices SET remaining_amount = remaining_amount - ? WHERE id = ?',
              [remainingAmount, invoice.id]
            );
            remainingAmount = 0;
          }
        }

        // If there's still remaining amount after all invoices are paid,
        // it becomes customer credit (you can store this in customer_details if needed)
        if (remainingAmount > 0) {
          // Optional: Store as credit balance in customer_details
          // await connection.query(
          //   'UPDATE customer_details SET credit_balance = COALESCE(credit_balance, 0) + ? WHERE contact_id = ?',
          //   [remainingAmount, contact_id]
          // );
        }
      }

      await connection.commit();
      return { id: receiptResult.insertId, ...receiptData };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM receipts');
    return rows;
  },
  update: async (id, updateData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Build dynamic SET clause
      const fields = [];
      const values = [];
      for (const [key, value] of Object.entries(updateData)) {
        if (key !== 'id' && value !== undefined) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
      values.push(id);

      const updateQuery = `UPDATE receipts SET ${fields.join(', ')} WHERE id = ?`;
      await connection.query(updateQuery, values);

      const [rows] = await connection.query('SELECT * FROM receipts WHERE id = ?', [id]);
      await connection.commit();

      return rows[0];
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  delete: async (id) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get receipt info before deleting to reverse account balance
      const [receiptRows] = await connection.query(
        'SELECT account_id, amount FROM receipts WHERE id = ?',
        [id]
      );

      if (receiptRows.length > 0) {
        const { account_id, amount } = receiptRows[0];

        // Reverse the account balance (subtract the amount that was added)
        await connection.query(
          'UPDATE accounts SET balance = balance - ? WHERE id = ?',
          [amount, account_id]
        );

        // Delete account history record
        await connection.query(
          'DELETE FROM account_history WHERE receipt_id = ?',
          [id]
        );
      }

      // Delete the receipt
      const deleteQuery = 'DELETE FROM receipts WHERE id = ?';
      await connection.query(deleteQuery, [id]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Paginated search with multi-term support
  findAllPaginated: async ({ page = 1, limit = 10, search = '' }) => {
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    if (search && search.trim()) {
      const terms = search.trim().split(/\s+/).filter(t => t.length > 0);
      if (terms.length > 0) {
        const searchFields = [
          'r.description', 'r.reference', 'r.note', 'r.amount',
          'c.contact_name', 'c.code', 'a.account_name'
        ];

        const termConditions = terms.map(term => {
          const fieldConditions = searchFields.map(field => {
            queryParams.push(`%${term}%`);
            return `${field} LIKE ?`;
          }).join(' OR ');
          return `(${fieldConditions})`;
        });

        whereConditions.push(`(${termConditions.join(' AND ')})`);
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM receipts r
      LEFT JOIN contacts c ON r.contact_id = c.id
      LEFT JOIN accounts a ON r.account_id = a.id
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    const dataQuery = `
      SELECT r.*, c.contact_name, c.code as contact_code, a.account_name
      FROM receipts r
      LEFT JOIN contacts c ON r.contact_id = c.id
      LEFT JOIN accounts a ON r.account_id = a.id
      ${whereClause}
      ORDER BY r.id DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.query(dataQuery, [...queryParams, limit, offset]);

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

};
module.exports = Receipt;