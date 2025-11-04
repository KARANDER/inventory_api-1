const db = require('../config/db');
const Receipt = {
  create: async (receiptData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const { date, amount, contact_id, account_id, description, reference, note, image_url, user_id } = receiptData;
      
      // Step 1: Insert the new receipt (No changes here)
      const receiptQuery = 'INSERT INTO receipts (date, amount, contact_id, account_id, description, reference, note, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const [receiptResult] = await connection.query(receiptQuery, [date, amount, contact_id, account_id, description, reference, note, image_url, user_id]);

      // Step 2: Update the bank account balance (No changes here)
      const updateAccountQuery = 'UPDATE accounts SET balance = balance + ? WHERE id = ?';
      await connection.query(updateAccountQuery, [amount, account_id]);

      // --- START: NEW LOGIC TO UPDATE CUSTOMER TOTAL ---
      if (contact_id && amount && amount > 0) {
        // First, verify the contact is actually a customer
        const [contactRows] = await connection.query(
          'SELECT type FROM contacts WHERE id = ? LIMIT 1',
          [contact_id]
        );

        // If a contact was found and their type is "Customer", proceed to update
        if (contactRows.length > 0 && contactRows[0].type === 'Customer') {
          const updateCustomerTotalQuery = `
            UPDATE customer_details
            SET total_amount = COALESCE(total_amount, 0) - ?
            WHERE contact_id = ?
          `;
          await connection.query(updateCustomerTotalQuery, [amount, contact_id]);
        }
      }
      // --- END: NEW LOGIC ---

      // --- START: NEW LOGIC FOR NO_1 AND NO_2 ACCOUNT TRACKING ---
    if (contact_id && amount && amount !== 0 && account_id) {
      // Step 4: Get account name to check if it's NO_1 or NO_2
      const [accountRows] = await connection.query(
        'SELECT account_name FROM accounts WHERE id = ? LIMIT 1',
        [account_id]
      );

      if (accountRows.length > 0) {
        const accountName = accountRows[0].account_name;

        // Step 5: Check if contact is a Customer before updating tracking fields
        const [contactRows] = await connection.query(
          'SELECT type FROM contacts WHERE id = ? LIMIT 1',
          [contact_id]
        );

        if (contactRows.length > 0 && contactRows[0].type === 'Customer') {
          // Step 6: Update appropriate tracking field based on account name
          if (accountName === 'NO_1') {
            const updateNo1Query = `
              UPDATE customer_details
              SET no_1 = COALESCE(no_1, 0) - ?
              WHERE contact_id = ?
            `;
            await connection.query(updateNo1Query, [amount, contact_id]);
          } 
          else if (accountName === 'NO_2') {
            const updateNo2Query = `
              UPDATE customer_details
              SET no_2 = COALESCE(no_2, 0) - ?
              WHERE contact_id = ?
            `;
            await connection.query(updateNo2Query, [amount, contact_id]);
          }
          // If account name is anything else, no additional updates needed
        }
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

};
module.exports = Receipt;