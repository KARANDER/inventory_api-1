const db = require('../config/db');
const Payment = {
  create: async (paymentData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Destructure payment data
      const { date, amount, account_id, contact_id, description, reference, note, image_url, user_id } = paymentData;

      // 1. Insert the new payment record (existing logic)
      const paymentQuery = 'INSERT INTO payments (date, amount, account_id, contact_id, description, reference, note, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const [paymentResult] = await connection.query(paymentQuery, [date, amount, account_id, contact_id, description, reference, note, image_url, user_id]);

      // 2. Update the account balance (existing logic)
      const updateAccountQuery = 'UPDATE accounts SET balance = balance - ? WHERE id = ?';
      await connection.query(updateAccountQuery, [amount, account_id]);

      // 2.5: Get updated balance and contact info for account history
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

      // 2.6: Insert account history record (DEBIT - money subtracted)
      const historyQuery = `
        INSERT INTO account_history 
        (account_id, transaction_type, amount, contact_id, contact_name, contact_type, 
         date, description, reference, payment_id, balance_after, user_id) 
        VALUES (?, 'DEBIT', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        paymentResult.insertId,
        balanceAfter,
        user_id || null
      ]);

      // 3. ✨ NEW: Update the supplier's total_amount if contact_id exists
      if (contact_id) {
        const updateSupplierQuery = 'UPDATE supplier_details SET total_amount = total_amount - ? WHERE contact_id = ?';
        await connection.query(updateSupplierQuery, [amount, contact_id]);
      }

      await connection.commit();
      return { id: paymentResult.insertId, ...paymentData };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM payments');
    return rows;
  },
  update: async (id, updateData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Build SET part dynamically for update fields
      const fields = [];
      const values = [];
      for (const [key, value] of Object.entries(updateData)) {
        if (key !== 'id' && value !== undefined) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
      values.push(id);

      const updateQuery = `UPDATE payments SET ${fields.join(', ')} WHERE id = ?`;
      await connection.query(updateQuery, values);

      const [rows] = await connection.query('SELECT * FROM payments WHERE id = ?', [id]);
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

      // Get payment info before deleting to reverse account balance
      const [paymentRows] = await connection.query(
        'SELECT account_id, amount FROM payments WHERE id = ?',
        [id]
      );

      if (paymentRows.length > 0) {
        const { account_id, amount } = paymentRows[0];

        // Reverse the account balance (add back the amount that was subtracted)
        await connection.query(
          'UPDATE accounts SET balance = balance + ? WHERE id = ?',
          [amount, account_id]
        );

        // Delete account history record
        await connection.query(
          'DELETE FROM account_history WHERE payment_id = ?',
          [id]
        );
      }

      // Delete the payment
      const deleteQuery = 'DELETE FROM payments WHERE id = ?';
      await connection.query(deleteQuery, [id]);

      await connection.commit();
      return;
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
          'p.description', 'p.reference', 'p.note', 'p.amount',
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
      FROM payments p
      LEFT JOIN contacts c ON p.contact_id = c.id
      LEFT JOIN accounts a ON p.account_id = a.id
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    const dataQuery = `
      SELECT p.*, c.contact_name, c.code as contact_code, a.account_name
      FROM payments p
      LEFT JOIN contacts c ON p.contact_id = c.id
      LEFT JOIN accounts a ON p.account_id = a.id
      ${whereClause}
      ORDER BY p.id DESC
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
module.exports = Payment;