const db = require('../config/db'); // Assuming you have a db config file

const Invoice = {
  create: async (invoiceData) => {

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insert into invoices table (Unchanged)
      const invoiceFields = [
        'invoice_number', 'invoice_date', 'customer_id', 'reference_no_1',
        'reference_no_2', 'sub_total', 'gst_amount', 'other_charge', 'other_charge_amount',
        'grand_total', 'tr_number', 'lr_number',
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
        invoiceData.other_charge || null,
        invoiceData.other_charge_amount || 0,
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
              WHERE item_code = ? AND finish = ? AND (customer_code = ? OR customer_id = ?) AND quantity_pcs > 0
              ORDER BY id ASC
              FOR UPDATE
          `, [item_code, item_finish, invoiceData.customer_id, invoiceData.customer_id]);
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

      const toNum = (v) => {
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : 0;
      };

      const buildAgg = (lineItems) => {
        const stock = {};
        const orders = {};

        for (const line of lineItems) {
          const itemCode = line.item_code;
          if (!itemCode) continue;

          const pcs = toNum(line.total_pcs);
          const kg = toNum(line.net_kg);
          const itemFinish = line.item_finish || '';

          if (!stock[itemCode]) {
            stock[itemCode] = { pcs: 0, kg: 0 };
          }
          stock[itemCode].pcs += pcs;
          stock[itemCode].kg += kg;

          if (itemFinish && pcs !== 0) {
            const key = `${itemCode}|||${itemFinish}`;
            orders[key] = (orders[key] || 0) + pcs;
          }
        }

        return { stock, orders };
      };

      const [invoiceRows] = await connection.query(
        'SELECT id, invoice_number, invoice_date, customer_id, grand_total, reference_no_1, reference_no_2 FROM invoices WHERE id = ? LIMIT 1 FOR UPDATE',
        [id]
      );
      if (invoiceRows.length === 0) {
        await connection.rollback();
        return { success: false, message: 'Invoice not found' };
      }
      const invoice = invoiceRows[0];

      const [existingItems] = await connection.query(
        'SELECT * FROM invoice_items WHERE invoice_id = ? FOR UPDATE',
        [id]
      );

      const existingById = new Map(existingItems.map((row) => [String(row.id), row]));
      const deletedIds = new Set((deleted_item_ids || []).map((x) => String(x)));

      for (const delId of deletedIds) {
        existingById.delete(delId);
      }

      let newCounter = 1;
      for (const item of items) {
        if (item.id) {
          const key = String(item.id);
          if (!existingById.has(key)) {
            throw new Error(`Invoice item with id ${item.id} not found for this invoice.`);
          }
          const oldRow = existingById.get(key);
          existingById.set(key, { ...oldRow, ...item });
        } else {
          existingById.set(`new-${newCounter++}`, { ...item });
        }
      }

      const finalItems = Array.from(existingById.values());

      const oldAgg = buildAgg(existingItems);
      const newAgg = buildAgg(finalItems);

      // 1) Adjust sales_orders by delta (new - old)
      const orderKeys = new Set([...Object.keys(oldAgg.orders), ...Object.keys(newAgg.orders)]);
      for (const key of orderKeys) {
        const oldPcs = oldAgg.orders[key] || 0;
        const newPcs = newAgg.orders[key] || 0;
        const deltaPcs = newPcs - oldPcs;
        if (deltaPcs === 0) continue;

        const [itemCode, itemFinish] = key.split('|||');

        if (deltaPcs > 0) {
          let remaining = deltaPcs;
          const [salesOrders] = await connection.query(
            `SELECT id, quantity_pcs
             FROM sales_orders
             WHERE item_code = ? AND finish = ? AND (customer_code = ? OR customer_id = ?) AND quantity_pcs > 0
             ORDER BY id ASC
             FOR UPDATE`,
            [itemCode, itemFinish, invoice.customer_id, invoice.customer_id]
          );

          for (const order of salesOrders) {
            if (remaining <= 0) break;
            const available = toNum(order.quantity_pcs);
            const deduct = Math.min(remaining, available);
            if (deduct <= 0) continue;

            await connection.query(
              'UPDATE sales_orders SET quantity_pcs = quantity_pcs - ? WHERE id = ?',
              [deduct, order.id]
            );
            remaining -= deduct;
          }

          if (remaining > 0) {
            throw new Error(`Insufficient quantity in sales orders for item ${itemCode}. Short by ${remaining} pcs.`);
          }
        } else {
          let remainingRestore = Math.abs(deltaPcs);
          const [salesOrders] = await connection.query(
            `SELECT id, quantity_pcs, initial_qty
             FROM sales_orders
             WHERE item_code = ? AND finish = ? AND (customer_code = ? OR customer_id = ?)
             ORDER BY id ASC
             FOR UPDATE`,
            [itemCode, itemFinish, invoice.customer_id, invoice.customer_id]
          );

          if (salesOrders.length === 0) {
            throw new Error(`Cannot restore quantity for item ${itemCode}: no matching sales orders found.`);
          }

          for (const order of salesOrders) {
            if (remainingRestore <= 0) break;

            const currentQty = toNum(order.quantity_pcs);
            const maxQty = order.initial_qty == null ? currentQty + remainingRestore : toNum(order.initial_qty);
            const canRestore = Math.max(maxQty - currentQty, 0);
            if (canRestore <= 0) continue;

            const addQty = Math.min(remainingRestore, canRestore);
            await connection.query(
              'UPDATE sales_orders SET quantity_pcs = quantity_pcs + ? WHERE id = ?',
              [addQty, order.id]
            );
            remainingRestore -= addQty;
          }

          if (remainingRestore > 0) {
            throw new Error(`Unable to fully restore sales order quantity for item ${itemCode}. Pending restore: ${remainingRestore} pcs.`);
          }
        }
      }

      // 2) Adjust master stock by delta (new - old)
      const stockKeys = new Set([...Object.keys(oldAgg.stock), ...Object.keys(newAgg.stock)]);
      for (const itemCode of stockKeys) {
        const oldStock = oldAgg.stock[itemCode] || { pcs: 0, kg: 0 };
        const newStock = newAgg.stock[itemCode] || { pcs: 0, kg: 0 };

        const deltaPcs = newStock.pcs - oldStock.pcs;
        const deltaKg = newStock.kg - oldStock.kg;

        if (deltaPcs === 0 && deltaKg === 0) continue;

        const [stockUpdateResult] = await connection.query(
          `UPDATE master_items
           SET stock_quantity = stock_quantity - ?,
               stock_kg = COALESCE(stock_kg, 0) - ?
           WHERE item_code = ?`,
          [deltaPcs, deltaKg, itemCode]
        );

        if (stockUpdateResult.affectedRows === 0) {
          throw new Error(`Master item not found for item_code ${itemCode}`);
        }

        const qtyPcs = Math.abs(deltaPcs);
        const qtyKg = Math.abs(deltaKg);
        const transactionType = (deltaPcs > 0 || (deltaPcs === 0 && deltaKg > 0)) ? 'DEBIT' : 'CREDIT';

        await connection.query(
          `INSERT INTO stock_history
          (item_code, transaction_type, invoice_type, invoice_number,
           quantity_pcs, quantity_kg, movement_date, note, user_id)
          VALUES (?, ?, 'SALES', ?, ?, ?, ?, ?, ?)`,
          [
            itemCode,
            transactionType,
            mainInvoiceData.invoice_number || invoice.invoice_number || null,
            qtyPcs,
            qtyKg,
            mainInvoiceData.invoice_date || invoice.invoice_date || new Date(),
            'Invoice update stock adjustment',
            mainInvoiceData.updated_by || null
          ]
        );
      }

      // Step 3: Update the main invoice details
      if (Object.keys(mainInvoiceData).length > 0) {
        const setClause = Object.keys(mainInvoiceData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(mainInvoiceData), id];
        await connection.query(`UPDATE invoices SET ${setClause} WHERE id = ?`, values);
      }

      // Step 4: Delete any line items the user removed
      if (deleted_item_ids && deleted_item_ids.length > 0) {
        const deleteQuery = 'DELETE FROM invoice_items WHERE id IN (?) AND invoice_id = ?';
        await connection.query(deleteQuery, [deleted_item_ids, id]);
      }

      // Step 5: Update existing items or insert new ones
      for (const item of items) {
        if (item.id) {
          const { id: itemId, ...itemData } = item;
          await connection.query('UPDATE invoice_items SET ? WHERE id = ? AND invoice_id = ?', [itemData, itemId, id]);
        } else {
          const itemData = { ...item, invoice_id: id };
          await connection.query('INSERT INTO invoice_items SET ?', itemData);
        }
      }

      // Step 6: Update customer_details with delta changes
      if (invoice.customer_id) {
        const [contactRows] = await connection.query(
          'SELECT id FROM contacts WHERE code = ? AND type = "Customer" LIMIT 1',
          [invoice.customer_id]
        );

        if (contactRows.length > 0) {
          const contactId = contactRows[0].id;
          const updateFields = [];
          const updateValues = [];

          // Calculate delta for grand_total
          const oldGrandTotal = toNum(invoice.grand_total);
          const newGrandTotal = toNum(mainInvoiceData.grand_total);
          const grandTotalDelta = newGrandTotal - oldGrandTotal;

          if (grandTotalDelta !== 0) {
            updateFields.push('total_amount = COALESCE(total_amount, 0) + ?');
            updateValues.push(grandTotalDelta);
          }

          // Calculate delta for reference_no_1
          const oldRefNo1 = toNum(invoice.reference_no_1);
          const newRefNo1 = toNum(mainInvoiceData.reference_no_1);
          const refNo1Delta = newRefNo1 - oldRefNo1;

          if (refNo1Delta !== 0) {
            updateFields.push('no_1 = COALESCE(no_1, 0) + ?');
            updateValues.push(refNo1Delta);
          }

          // Calculate delta for reference_no_2
          const oldRefNo2 = toNum(invoice.reference_no_2);
          const newRefNo2 = toNum(mainInvoiceData.reference_no_2);
          const refNo2Delta = newRefNo2 - oldRefNo2;

          if (refNo2Delta !== 0) {
            updateFields.push('no_2 = COALESCE(no_2, 0) + ?');
            updateValues.push(refNo2Delta);
          }

          // Execute update if there are changes
          if (updateFields.length > 0) {
            updateValues.push(contactId);
            const updateCustomerQuery = `
              UPDATE customer_details
              SET ${updateFields.join(', ')}
              WHERE contact_id = ?
            `;
            await connection.query(updateCustomerQuery, updateValues);
          }
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

  undoInvoice: async (id, undoByUserId = null, undoReason = null) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [invoiceRows] = await connection.query(
        `SELECT id, invoice_number, invoice_date, customer_id, reference_no_1, reference_no_2, grand_total
         FROM invoices WHERE id = ? LIMIT 1 FOR UPDATE`,
        [id]
      );

      if (invoiceRows.length === 0) {
        await connection.rollback();
        return { success: false, message: 'Invoice not found' };
      }

      const invoice = invoiceRows[0];

      const [items] = await connection.query(
        `SELECT item_code, item_finish, total_pcs, net_kg
         FROM invoice_items WHERE invoice_id = ? FOR UPDATE`,
        [id]
      );

      const [cartons] = await connection.query(
        `SELECT carton_number FROM shipping_cartons WHERE invoice_id = ? FOR UPDATE`,
        [id]
      );

      // 1) Reverse carton inventory
      const cartonCounts = {};
      for (const carton of cartons) {
        if (!carton.carton_number) continue;
        cartonCounts[carton.carton_number] = (cartonCounts[carton.carton_number] || 0) + 1;
      }
      for (const cartonName of Object.keys(cartonCounts)) {
        await connection.query(
          'UPDATE carton_inventory SET carton_quantity = carton_quantity + ? WHERE carton_name = ?',
          [cartonCounts[cartonName], cartonName]
        );
      }

      // 2) Reverse stock + stock history + sales_orders quantity
      for (const item of items) {
        const itemCode = item.item_code;
        const itemFinish = item.item_finish;
        const totalPcs = parseFloat(item.total_pcs) || 0;
        const totalKg = parseFloat(item.net_kg) || 0;

        if (!itemCode || totalPcs <= 0) continue;

        await connection.query(
          `UPDATE master_items
           SET stock_quantity = stock_quantity + ?,
               stock_kg = COALESCE(stock_kg, 0) + ?
           WHERE item_code = ?`,
          [totalPcs, totalKg, itemCode]
        );

        await connection.query(
          `INSERT INTO stock_history
          (item_code, transaction_type, invoice_type, invoice_number,
           quantity_pcs, quantity_kg, movement_date, note, user_id)
          VALUES (?, 'CREDIT', 'SALES', ?, ?, ?, ?, ?, ?)`,
          [
            itemCode,
            invoice.invoice_number || null,
            totalPcs,
            totalKg,
            new Date(),
            undoReason || `Undo invoice ${invoice.invoice_number || id}`,
            undoByUserId || null
          ]
        );

        if (itemFinish) {
          let remainingRestore = totalPcs;
          const [salesOrders] = await connection.query(
            `SELECT id, quantity_pcs, initial_qty
             FROM sales_orders
             WHERE item_code = ? AND finish = ? AND (customer_code = ? OR customer_id = ?)
             ORDER BY id ASC
             FOR UPDATE`,
            [itemCode, itemFinish, invoice.customer_id, invoice.customer_id]
          );

          for (const order of salesOrders) {
            if (remainingRestore <= 0) break;

            const currentQty = parseFloat(order.quantity_pcs) || 0;
            const initialQtyRaw = order.initial_qty;
            const maxQty = initialQtyRaw == null ? currentQty + remainingRestore : parseFloat(initialQtyRaw) || 0;
            const canRestore = Math.max(maxQty - currentQty, 0);
            if (canRestore <= 0) continue;

            const addQty = Math.min(remainingRestore, canRestore);
            await connection.query(
              'UPDATE sales_orders SET quantity_pcs = quantity_pcs + ? WHERE id = ?',
              [addQty, order.id]
            );
            remainingRestore -= addQty;
          }
        }
      }

      // 3) Reverse customer totals
      const customerCode = invoice.customer_id;
      const grandTotal = parseFloat(invoice.grand_total) || 0;
      const refNo1 = parseFloat(invoice.reference_no_1) || 0;
      const refNo2 = parseFloat(invoice.reference_no_2) || 0;

      if (customerCode) {
        const [contactRows] = await connection.query(
          'SELECT id FROM contacts WHERE code = ? AND type = "Customer" LIMIT 1',
          [customerCode]
        );

        if (contactRows.length > 0) {
          const contactId = contactRows[0].id;
          await connection.query(
            `UPDATE customer_details
             SET total_amount = COALESCE(total_amount, 0) - ?,
                 no_1 = COALESCE(no_1, 0) - ?,
                 no_2 = COALESCE(no_2, 0) - ?
             WHERE contact_id = ?`,
            [grandTotal, refNo1, refNo2, contactId]
          );
        }
      }

      // 4) Finally hard delete invoice row (children auto-delete via FK)
      const [deleteResult] = await connection.query('DELETE FROM invoices WHERE id = ?', [id]);

      await connection.commit();
      return {
        success: true,
        deletedCount: deleteResult.affectedRows,
        reversedItems: items.length,
        reversedCartons: cartons.length,
        invoice_number: invoice.invoice_number
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
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

  // Paginated invoice summary with search
  getInvoiceSummaryPaginated: async ({ page = 1, limit = 10, search = '' }) => {
    const currentDate = new Date();
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    if (search && search.trim()) {
      const terms = search.trim().split(/\s+/).filter(t => t.length > 0);
      if (terms.length > 0) {
        const searchFields = ['i.invoice_number', 'i.customer_id'];

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

    // Count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM invoices i
      LEFT JOIN contacts c ON i.customer_id = c.code
      LEFT JOIN customer_details cd ON c.id = cd.contact_id
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    // Data query
    const dataQuery = `
      SELECT 
        i.id, i.invoice_number AS invoiceNo, i.invoice_date, i.customer_id,
        i.reference_no_1 AS No1, i.reference_no_2 AS No2, cd.credit_period,
        i.remaining_amount
      FROM invoices i
      LEFT JOIN contacts c ON i.customer_id = c.code
      LEFT JOIN customer_details cd ON c.id = cd.contact_id
      ${whereClause}
      ORDER BY i.id DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.query(dataQuery, [...queryParams, limit, offset]);

    const parseNumber = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    const data = rows.map(row => {
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
      return {
        id: row.id, invoiceNo: row.invoiceNo, cutomer_id: row.customer_id, daysElapsed,
        creditDays, daysLeft: daysLeft >= 0 ? daysLeft : 0, daysOverdue, status,
        No1: row.No1 || 0, No2: row.No2 || 0, No1_plus_No2: parseNumber(row.No1) + parseNumber(row.No2),
        remaining_amount: parseNumber(row.remaining_amount)
      };
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
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

    } catch (error) {
      console.error("Error in getStatementByCustomerId:", error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },
};

module.exports = Invoice;