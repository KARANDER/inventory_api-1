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