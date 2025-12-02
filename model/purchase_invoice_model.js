const db = require('../config/db');

const PurchaseInvoice = {
  createWithStockUpdate: async (invoiceData, lineItems, userCode, invoiceTotal) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert the main invoice record
      const invoiceQuery = 'INSERT INTO purchase_invoices SET ?';
      const [invoiceResult] = await connection.query(invoiceQuery, invoiceData);
      const newInvoiceId = invoiceResult.insertId;

      // Loop through each line item
      if (lineItems && lineItems.length > 0) {
        for (const item of lineItems) {
          // 1. Insert the purchase invoice item as usual
          const { id, ...itemData } = item; // Exclude any temporary front-end ID
          itemData.invoice_id = newInvoiceId;
          const itemQuery = 'INSERT INTO purchase_invoice_items SET ?';
          await connection.query(itemQuery, itemData);

          // --- NEW STOCK UPDATE LOGIC ---
          // 2. Check if there is a 'code' and a 'total_psc' / 'net_kg' to update master stock
          //    - stock_quantity  : managed in PCS  (item.total_psc)
          //    - stock_kg        : managed in KG   (item.net_kg or item.total_kg)
          const totalPcs = parseFloat(item.total_psc) || 0;
          const totalKg =
            parseFloat(item.net_kg || item.total_kg) || 0; // support either net_kg or total_kg

          if (item.code && totalPcs > 0) {
            const stockUpdateQuery = `
              UPDATE master_items 
              SET stock_quantity = stock_quantity + ?, 
                  stock_kg       = COALESCE(stock_kg, 0) + ?
              WHERE item_code = ?
            `;
            // This query will only affect a row if a matching item_code is found.
            // If not found, it does nothing and the transaction continues.
            await connection.query(stockUpdateQuery, [totalPcs, totalKg, item.code]);

            // Insert stock history (CREDIT - stock in via purchase invoice)
            const historyQuery = `
              INSERT INTO stock_history
              (item_code, transaction_type, invoice_type, invoice_number,
               quantity_pcs, quantity_kg, movement_date, note, user_id)
              VALUES (?, 'CREDIT', 'PURCHASE', ?, ?, ?, ?, ?, ?)
            `;
            await connection.query(historyQuery, [
              item.code,
              invoiceData.invoice_number || null,
              totalPcs,
              totalKg,
              invoiceData.issue_date || new Date(),
              null,
              invoiceData.created_by || null
            ]);
          }
          // --- END OF NEW LOGIC ---
        }
      }
      
      // Update supplier's total amount if applicable
      if (userCode && invoiceTotal > 0) {
        const [contacts] = await connection.query('SELECT id FROM contacts WHERE code = ?', [userCode]);
        if (contacts.length > 0) {
          const contactId = contacts[0].id;
          const updateSupplierQuery = 'UPDATE supplier_details SET total_amount = total_amount + ? WHERE contact_id = ?';
          await connection.query(updateSupplierQuery, [invoiceTotal, contactId]);
        }
      }

      await connection.commit();
      return { id: newInvoiceId, ...invoiceData, line_items: lineItems };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // REPLACE the old updateWithItems function with this one

updateWithItems: async (invoiceId, invoiceData, lineItems = [], deletedItemIds = []) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Step 1: Update the main invoice details
        if (Object.keys(invoiceData).length > 0) {
            await connection.query('UPDATE purchase_invoices SET ? WHERE id = ?', [invoiceData, invoiceId]);
        }

        // Step 2: Delete any items that were removed
        if (deletedItemIds.length > 0) {
            const deleteQuery = 'DELETE FROM purchase_invoice_items WHERE id IN (?) AND invoice_id = ?';
            await connection.query(deleteQuery, [deletedItemIds, invoiceId]);
        }

        // Step 3: Loop through items to ONLY update existing ones
        for (const item of lineItems) {
            // This 'if' block remains the same.
            if (item.id) {
                // If it has an ID, it's an existing item. UPDATE it.
                const { id, ...itemData } = item;
                await connection.query('UPDATE purchase_invoice_items SET ? WHERE id = ? AND invoice_id = ?', [itemData, id, invoiceId]);
            } 
            // --- CHANGE: The 'else' block below has been completely removed. ---
            // else {
            //    // If it has no ID, it's a new item. INSERT it.
            //    item.invoice_id = invoiceId;
            //    await connection.query('INSERT INTO purchase_invoice_items SET ?', item);
            // }
        }

        await connection.commit();
        const updatedItems = await connection.query('SELECT * FROM purchase_invoice_items WHERE invoice_id = ?', [invoiceId]);
        return { id: invoiceId, ...invoiceData, line_items: updatedItems[0] };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
},

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM purchase_invoices ORDER BY issue_date DESC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM purchase_invoices WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  findAllWithTotalAmount: async () => {
    const query = `
      SELECT
        pi.id,
        pi.code_user,
        pi.invoice_number,
        pi.issue_date,
        COALESCE(SUM(pii.amount), 0.00) AS total_amount
      FROM
        purchase_invoices AS pi
      LEFT JOIN
        purchase_invoice_items AS pii ON pi.id = pii.invoice_id
      GROUP BY
        pi.id
      ORDER BY
        pi.issue_date DESC;
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  findItemsByInvoiceId: async (invoiceId) => {
    const [rows] = await db.query('SELECT * FROM purchase_invoice_items WHERE invoice_id = ?', [invoiceId]);
    return rows;
  },

  deleteInvoice: async (id) => {
    const [result] = await db.query('DELETE FROM purchase_invoices WHERE id = ?', [id]);
    return result.affectedRows;
  },

  getDetailsByCodeUser: async (codeUser) => {
    const query = 'SELECT scrap, labour, kg_dzn, total_kg, description FROM inventory_items WHERE code_user = ? LIMIT 1';
    const [rows] = await db.query(query, [codeUser]);
    return rows.length ? rows[0] : null;
  },

  findImagesByInvoiceId: async (invoiceId) => {
    const [rows] = await db.query('SELECT * FROM purchase_invoice_images WHERE invoice_id = ?', [invoiceId]);
    return rows;
  },
  findCodeUserByUser: async (user) => {
    const [rows] = await db.query('SELECT code_user FROM inventory_items WHERE user = ?', [user]);
    return rows.map(row => row.code_user);
  },
};

module.exports = PurchaseInvoice;