const db = require('../config/db'); // Assuming you have a db config file

const Invoice = {
  create: async (invoiceData) => {
    // --- START: CARTON STOCK VALIDATION LOGIC --- (Unchanged)
    if (invoiceData.cartons && invoiceData.cartons.length > 0) {
      const requiredCounts = {};
      for (const carton of invoiceData.cartons) {
        if (carton.carton_number) {
          requiredCounts[carton.carton_number] = (requiredCounts[carton.carton_number] || 0) + 1;
        }
      }
      const requiredCartonNames = Object.keys(requiredCounts);

      const [availableStockRows] = await db.query(
        'SELECT carton_name, carton_quantity FROM carton_inventory WHERE carton_name IN (?)',
        [requiredCartonNames]
      );

      const availableStockMap = new Map(
        availableStockRows.map(row => [row.carton_name, row.carton_quantity])
      );

      for (const cartonName of requiredCartonNames) {
        const required = requiredCounts[cartonName];
        const available = availableStockMap.get(cartonName) || 0;

        if (required > available) {
          throw new Error(`Insufficient stock for carton ${cartonName}. Required: ${required}, Available: ${available}.`);
        }
      }
    }
    // --- END: CARTON STOCK VALIDATION LOGIC ---


    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insert into invoices table (Unchanged)
      const invoiceFields = [
        'invoice_number', 'invoice_date', 'customer_id', 'reference_no_1',
        'reference_no_2', 'sub_total', 'gst_amount', 'grand_total', 'tr_number', 'lr_number',
        'remaining_amount' // Added new field
      ];
     const invoiceValues = [
        invoiceData.invoice_number || null,
        invoiceData.invoice_date || null,
        invoiceData.customer_id || null,
        invoiceData.reference_no_1 || null,
        invoiceData.reference_no_2 || null,
        invoiceData.sub_total || 0,
        invoiceData.gst_amount || 0,
        invoiceData.grand_total || 0,
        invoiceData.tr_number || null,
        invoiceData.lr_number || null,
        invoiceData.grand_total || 0 // Set remaining_amount = grand_total
      ];
      const invoiceQuery = `INSERT INTO invoices (${invoiceFields.join(', ')}) VALUES (?)`;
      const [invoiceResult] = await connection.query(invoiceQuery, [invoiceValues]);
      const newInvoiceId = invoiceResult.insertId;

      // 2. Insert invoice_items
      if (invoiceData.items && invoiceData.items.length > 0) {
        // --- CHANGE: Added 'rate_kg' to the list of fields ---
        const itemFields = [
          'invoice_id', 'item_code', 'item_description', 'item_size', 'item_finish',
          'pcs_per_box', 'total_boxes', 'extra_pcs', 'total_pcs', 'total_weight',
          'scrap_lb', 'total_rs', 'brass', 'kg_box', 'lb', 'pcs_rate', 'rate_kg', 'box_wt',
          'tmp_wt', 'net_kg', 'box_name'
        ];
        const itemQuery = `INSERT INTO invoice_items (${itemFields.join(', ')}) VALUES ?`;
        const itemValues = invoiceData.items.map(item => [
          newInvoiceId,
          item.item_code || null,
          item.item_description || null,
          item.item_size || null,
          item.item_finish || null,
          item.pcs_per_box || 0,
          item.total_boxes || 0,
          item.extra_pcs || 0,
          item.total_pcs || 0,
          item.total_weight || 0,
          item.scrap_lb || 0,
          item.total_rs || 0,
          item.brass || 0,
          item.kg_box || 0,
          item.lb || 0,
          item.pcs_rate || 0,
          item.rate_kg || null, // --- CHANGE: Added value for the new field ---
          item.box_wt || 0,
          item.tmp_wt || 0,
          item.net_kg || 0,
          item.box_name || null
        ]);
        await connection.query(itemQuery, [itemValues]);
      }

      // 3. Insert shipping cartons
      if (invoiceData.cartons && invoiceData.cartons.length > 0) {
        const cartonFields = ['invoice_id', 'carton_number', 'carton_weight', 'weight_per_ctn'];
        const cartonQuery = `INSERT INTO shipping_cartons (${cartonFields.join(', ')}) VALUES ?`;
        const cartonValues = invoiceData.cartons.map(carton => [
          newInvoiceId,
          carton.carton_number || null,
          carton.carton_weight || 0,
          carton.weight_per_ctn || 0
        ]);
        await connection.query(cartonQuery, [cartonValues]);
      }

      // 4. Update carton inventory (Unchanged)
      if (invoiceData.cartons && invoiceData.cartons.length > 0) {
        const cartonCounts = {};
        for (const carton of invoiceData.cartons) {
          if (carton.carton_number) {
            cartonCounts[carton.carton_number] = (cartonCounts[carton.carton_number] || 0) + 1;
          }
        }
        for (const cartonName in cartonCounts) {
          const countToSubtract = cartonCounts[cartonName];
          const updateInventoryQuery = `
            UPDATE carton_inventory
            SET carton_quantity = carton_quantity - ?
            WHERE carton_name = ?`;
          await connection.query(updateInventoryQuery, [countToSubtract, cartonName]);
        }
      }

      // 5. Update master stock (PCS & KG) and sales orders, and record stock history
      for (const item of invoiceData.items) {
       const { item_code, item_finish, total_pcs, net_kg } = item;
    
        if (!item_code || total_pcs == null) {
          throw new Error('Item with missing item_code or total_pcs found.');
        }

        // REMOVED: Stock validation check entirely
        // This allows negative stock (overselling/backorder)
        
        const totalKg = parseFloat(net_kg) || 0;

        // Direct stock update - now allows negative values
        const updateStockQuery = `
          UPDATE master_items 
          SET stock_quantity = stock_quantity - ?, 
              stock_kg       = COALESCE(stock_kg, 0) - ?
          WHERE item_code = ?
        `;
        await connection.query(updateStockQuery, [total_pcs, totalKg, item_code]);
        // Insert stock history (DEBIT - stock out via sales invoice)
        const historyQuery = `
          INSERT INTO stock_history
          (item_code, transaction_type, invoice_type, invoice_number,
           quantity_pcs, quantity_kg, movement_date, note, user_id)
          VALUES (?, 'DEBIT', 'SALES', ?, ?, ?, ?, ?, ?)
        `;
        await connection.query(historyQuery, [
          item_code,
          invoiceData.invoice_number || null,
          total_pcs,
          totalKg,
          invoiceData.invoice_date || new Date(),
          null,
          invoiceData.created_by || null
        ]);
        let total_pcs_to_invoice = total_pcs;
        if (item_code && item_finish && total_pcs_to_invoice > 0) {
          const [salesOrders] = await connection.query(`
              SELECT id, quantity_pcs FROM sales_orders
              WHERE item_code = ? AND finish = ? AND quantity_pcs > 0
              ORDER BY id ASC
              FOR UPDATE
          `, [item_code, item_finish]);
          if (salesOrders && salesOrders.length > 0) {
            for (const order of salesOrders) {
                if (total_pcs_to_invoice <= 0) {
                    break; 
                }
                const available_in_this_order = parseFloat(order.quantity_pcs) || 0;
                const amount_to_subtract = Math.min(total_pcs_to_invoice, available_in_this_order);
                await connection.query(
                    'UPDATE sales_orders SET quantity_pcs = quantity_pcs - ? WHERE id = ?',
                    [amount_to_subtract, order.id]
                );
                total_pcs_to_invoice -= amount_to_subtract;
            }
            if (total_pcs_to_invoice > 0) {
                throw new Error(`Insufficient quantity in sales orders for item ${item_code}. Short by ${total_pcs_to_invoice} pcs.`);
            }
          }
        }
      }

      // 6. Update customer total (Unchanged)
      const { customer_id, grand_total } = invoiceData;
      if (customer_id && grand_total && grand_total > 0) {
        const [contactRows] = await connection.query(
          'SELECT id FROM contacts WHERE code = ? AND type = "Customer" LIMIT 1',
          [customer_id]
        );
        if (contactRows.length > 0) {
          const contactId = contactRows[0].id;
          const updateCustomerTotalQuery = `
            UPDATE customer_details
            SET total_amount = COALESCE(total_amount, 0) + ?
            WHERE contact_id = ?
          `;
          await connection.query(updateCustomerTotalQuery, [grand_total, contactId]);
        }
      }

      // --- NEW: Update customer reference numbers (no_1 and no_2) ---
    const { reference_no_1, reference_no_2 } = invoiceData;
    if (customer_id && (reference_no_1 || reference_no_2)) {
      // Step 1: Find contact ID from contacts table using customer_id
      const [contactRows] = await connection.query(
        'SELECT id FROM contacts WHERE code = ? LIMIT 1',
        [customer_id]
      );
      
      if (contactRows.length > 0) {
        const contactId = contactRows[0].id;
        
        // Step 2: Update no_1 and no_2 in customer_details table
        const updateFields = [];
        const updateValues = [];
        
        if (reference_no_1 !== null && reference_no_1 !== undefined) {
          updateFields.push('no_1 = COALESCE(no_1, 0) + ?');
          updateValues.push(reference_no_1);
        }
        
        if (reference_no_2 !== null && reference_no_2 !== undefined) {
          updateFields.push('no_2 = COALESCE(no_2, 0) + ?');
          updateValues.push(reference_no_2);
        }
        
        if (updateFields.length > 0) {
          updateValues.push(contactId);
          const updateReferenceQuery = `
            UPDATE customer_details 
            SET ${updateFields.join(', ')} 
            WHERE contact_id = ?
          `;
          await connection.query(updateReferenceQuery, updateValues);
        }
      }
    }


      await connection.commit();
      return { id: newInvoiceId, ...invoiceData };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM invoices WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  findAll: async () => {
    // This function already uses SELECT *, so it will automatically include 'rate_kg'. No changes needed.
    const invoicesQuery = 'SELECT * FROM invoices ORDER BY id DESC';
    const [invoices] = await db.query(invoicesQuery);

    for (const invoice of invoices) {
      const itemsQuery = 'SELECT * FROM invoice_items WHERE invoice_id = ?';
      const [items] = await db.query(itemsQuery, [invoice.id]);
      invoice.items = items; 

      let totalNetKg = 0;
      if (items && items.length > 0) {
        totalNetKg = items.reduce((sum, item) => {
          return sum + (parseFloat(item.net_kg) || 0);
        }, 0);
      }
      invoice.total_net_kg = parseFloat(totalNetKg.toFixed(3));

      const cartonsQuery = 'SELECT * FROM shipping_cartons WHERE invoice_id = ?';
      const [cartons] = await db.query(cartonsQuery, [invoice.id]);
      invoice.cartons = cartons;
    }
    return invoices;
  },

  // --- CHANGE: Replaced the old simple update function with this advanced one ---
  update: async (id, invoiceData) => {
    const { items = [], deleted_item_ids = [], ...mainInvoiceData } = invoiceData;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Step 1: Update the main invoice details (e.g., invoice_date)
        if (Object.keys(mainInvoiceData).length > 0) {
            const setClause = Object.keys(mainInvoiceData).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(mainInvoiceData), id];
            await connection.query(`UPDATE invoices SET ${setClause} WHERE id = ?`, values);
        }

        // Step 2: Delete any line items the user removed
        if (deleted_item_ids && deleted_item_ids.length > 0) {
            const deleteQuery = 'DELETE FROM invoice_items WHERE id IN (?) AND invoice_id = ?';
            await connection.query(deleteQuery, [deleted_item_ids, id]);
        }

        // Step 3: Update existing items or insert new ones
        for (const item of items) {
            if (item.id) {
                // Update existing item
                const { id: itemId, ...itemData } = item;
                await connection.query('UPDATE invoice_items SET ? WHERE id = ? AND invoice_id = ?', [itemData, itemId, id]);
            } else {
                // Insert new item
                item.invoice_id = id;
                await connection.query('INSERT INTO invoice_items SET ?', item);
            }
        }
        
        await connection.commit();
        return { success: true, message: 'Invoice updated successfully.' };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
  },

  delete: async (id) => {
    // Unchanged
    const query = 'DELETE FROM invoices WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
  },
  
  getInvoiceSummary: async () => {
    // Unchanged
    const currentDate = new Date();
    const query = `
      SELECT 
        i.id, i.invoice_number AS invoiceNo, i.invoice_date, i.customer_id,
        i.reference_no_1 AS No1, i.reference_no_2 AS No2, cd.credit_period,
        i.remaining_amount
      FROM invoices i
      LEFT JOIN contacts c ON i.customer_id = c.code
      LEFT JOIN customer_details cd ON c.id = cd.contact_id
      ORDER BY i.id DESC
    `;
    const [rows] = await db.query(query);
    return rows.map(row => {
      const invoiceDate = new Date(row.invoice_date);
      const diffTime = currentDate - invoiceDate;
      const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      let creditDays = 0;
      if (row.credit_period) {
        const match = row.credit_period.match(/\d+/);
        creditDays = match ? parseInt(match[0]) : 0;
      }
      const daysLeft = creditDays - daysElapsed;
      const daysOverdue = daysLeft < 0 ? Math.abs(daysLeft) : 0;
      let status = 'PENDING';
      if (daysOverdue > 0) {
        status = 'OVERDUE';
      }
      const parseNumber = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      };
      return {
        id: row.id, invoiceNo: row.invoiceNo, cutomer_id: row.customer_id, daysElapsed,
        creditDays, daysLeft: daysLeft >= 0 ? daysLeft : 0, daysOverdue, status,
        No1: row.No1 || 0, No2: row.No2 || 0, No1_plus_No2: parseNumber(row.No1) + parseNumber(row.No2),
        remaining_amount: parseNumber(row.remaining_amount)
      };
    });
  },
  // Add this new function inside the Invoice object, for example, after getInvoiceSummary.

  getStatementByCustomerId: async (customerId) => {
    const connection = await db.getConnection();
    try {
      // Step 1: Get all invoices for the customer, with their overdue days
      const sqlQuery = `
        SELECT 
          customer_id,
          invoice_date AS data, 
          invoice_number,
          invoice_number AS description, 
          grand_total,
          remaining_amount AS remaining_balance,
          DATEDIFF(NOW(), invoice_date) AS overdue_days
        FROM 
          invoices
        WHERE 
          customer_id = ? 
        ORDER BY 
          invoice_date ASC
      `;

      const [invoiceRows] = await connection.query(sqlQuery, [customerId]);

      // Step 2: Create the aging summary object with all 6 fields
      const agingSummary = {
        "current_balance": 0,
        "overdue_1_30": 0,
        "overdue_31_60": 0,
        "overdue_61_90": 0,
        "overdue_90_plus": 0,
        "total_balance": 0
      };

      const parseNumber = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      };

      // Step 3: Loop through invoices to calculate all summary totals
      for (const invoice of invoiceRows) {
        const balance = parseNumber(invoice.remaining_balance);
        const days = parseInt(invoice.overdue_days, 10) || 0;

        // Add to the grand total every time
        agingSummary.total_balance += balance;

        // Sort into the correct bucket
        if (days <= 0) {
          agingSummary.current_balance += balance;
        } else if (days >= 1 && days <= 30) {
          agingSummary.overdue_1_30 += balance;
        } else if (days >= 31 && days <= 60) {
          agingSummary.overdue_31_60 += balance;
        } else if (days >= 61 && days <= 90) {
          agingSummary.overdue_61_90 += balance;
        } else if (days > 90) {
          agingSummary.overdue_90_plus += balance;
        }
      }

      // Format summary to 2 decimal places
      for (const key in agingSummary) {
        agingSummary[key] = parseFloat(agingSummary[key].toFixed(2));
      }

      // Step 4: Return both the list and the summary
      return {
        invoice_list: invoiceRows,
        aging_summary: agingSummary
      };

    } catch (error)
      {
      console.error("Error in getStatementByCustomerId:", error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },
};

module.exports = Invoice;