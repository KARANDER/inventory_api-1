const db = require('../config/db');

const Contact = {
  // --- REWRITTEN create function ---
  create: async (contactData) => {
    const { type, ...baseData } = contactData;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Create the base contact record
      const { contact_name, code, email, image_url, address, created_by } = baseData;
      const contactQuery = 'INSERT INTO contacts (contact_name, type, code, email, image_url, address, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const [result] = await connection.query(contactQuery, [contact_name, type, code, email, image_url, address, created_by]);
      const contactId = result.insertId;

      // 2. Based on the type, insert into the correct details table
      if (type === 'Customer') {
    // Add the new fields here
    const { 
        credit_period, billing_address, delivery_address, gstin, pan, 
        place_of_supply, reverse_charge, type_of_registration, total_amount,
        // ADD these new fields
        notes, payment, date, order_follow_up, no_1,no_2 
    } = baseData.details;

    // Update the INSERT query
    const customerQuery = `INSERT INTO customer_details 
        (contact_id, credit_period, billing_address, delivery_address, gstin, pan, 
         place_of_supply, reverse_charge, type_of_registration, total_amount,
         notes, payment, date, order_follow_up,no_1,no_2) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Add the new values to the array
    await connection.query(customerQuery, [
        contactId, credit_period, billing_address, delivery_address, gstin, pan, 
        place_of_supply, reverse_charge, type_of_registration, total_amount,
        notes, payment, date, order_follow_up,no_1,no_2
    ]);
}
 else if (type === 'Supplier') {
    // Add the new fields here
    const { 
        credit_limit, division, due_date, payment_status, note, total_amount,
        // ADD these new fields
        notes, payment, date, order_follow_up 
    } = baseData.details;

    // Update the INSERT query
    const supplierQuery = `INSERT INTO supplier_details 
        (contact_id, credit_limit, division, due_date, payment_status, note, total_amount,
         notes, payment, date, order_follow_up) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Add the new values to the array
    await connection.query(supplierQuery, [
        contactId, credit_limit, division, due_date, payment_status, note, total_amount,
        notes, payment, date, order_follow_up
    ]);
}

      await connection.commit();
      return { id: contactId, ...contactData };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // --- REWRITTEN findAll function ---
  findAll: async () => {
    const query = `
        SELECT
            c.*,
            cd.credit_period, cd.billing_address, cd.delivery_address, cd.gstin, cd.pan, 
            cd.place_of_supply, cd.reverse_charge, cd.type_of_registration, cd.total_amount,
            cd.notes, cd.payment, cd.date, cd.order_follow_up,cd.no_1,cd.no_2,
            sd.credit_limit, sd.division, sd.due_date, sd.payment_status, sd.note
        FROM contacts c
        LEFT JOIN customer_details cd ON c.id = cd.contact_id
        LEFT JOIN supplier_details sd ON c.id = sd.contact_id
    `;
    const [rows] = await db.query(query);
    return rows;
},


  update: async (id, updateData) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Update base contact data
      const { type, details, ...baseData } = updateData;

      if (Object.keys(baseData).length > 0) {
        // Build dynamic SET clause for contacts table
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(baseData)) {
          if (value !== undefined && key !== 'id' && key !== 'updated_by') { // Assuming updated_by is managed separately or not in baseData
             fields.push(`${key} = ?`);
             values.push(value);
          }
        }
        
        if (fields.length > 0) {
            values.push(id);
            const updateContactQuery = `UPDATE contacts SET ${fields.join(', ')} WHERE id = ?`;
            await connection.query(updateContactQuery, values);
        }
      }

      // Update customer_details or supplier_details based on type
      if (type === 'Customer' && details && Object.keys(details).length > 0) {
        const customerFields = [];
        const customerValues = [];
        for (const [key, value] of Object.entries(details)) {
          customerFields.push(`${key} = ?`);
          customerValues.push(value);
        }
        customerValues.push(id); // contact_id
        const updateCustomerQuery = `UPDATE customer_details SET ${customerFields.join(', ')} WHERE contact_id = ?`;
        await connection.query(updateCustomerQuery, customerValues);
      } else if (type === 'Supplier' && details && Object.keys(details).length > 0) {
        const supplierFields = [];
        const supplierValues = [];
        for (const [key, value] of Object.entries(details)) {
          supplierFields.push(`${key} = ?`);
          supplierValues.push(value);
        }
        supplierValues.push(id); // contact_id
        const updateSupplierQuery = `UPDATE supplier_details SET ${supplierFields.join(', ')} WHERE contact_id = ?`;
        await connection.query(updateSupplierQuery, supplierValues);
      }

      await connection.commit();

      // Return the updated contact row with joined details (optional)
      // UPDATED query to select total_amount
      const [rows] = await connection.query(
    `SELECT c.*, cd.credit_period, cd.billing_address, cd.delivery_address, cd.gstin, cd.pan, 
     cd.place_of_supply, cd.reverse_charge, cd.type_of_registration, cd.total_amount,
     cd.notes, cd.payment, cd.date, cd.order_follow_up,cd.no_1,cd.no_2,
     sd.credit_limit, sd.division, sd.due_date, sd.payment_status, sd.note
     FROM contacts c
     LEFT JOIN customer_details cd ON c.id = cd.contact_id
     LEFT JOIN supplier_details sd ON c.id = sd.contact_id
     WHERE c.id = ?`, [id]
);

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

      // Delete from customer_details and supplier_details if exists
      await connection.query('DELETE FROM customer_details WHERE contact_id = ?', [id]);
      await connection.query('DELETE FROM supplier_details WHERE contact_id = ?', [id]);

      // Delete from base contacts table
      await connection.query('DELETE FROM contacts WHERE id = ?', [id]);

      await connection.commit();

      return;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  findAllContactCodes: async () => {
    const [rows] = await db.query('SELECT DISTINCT code FROM contacts WHERE code IS NOT NULL ORDER BY code');
    return rows;
},

}
module.exports = Contact;