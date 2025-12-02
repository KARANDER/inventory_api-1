const db = require('../config/db');

const SalesInvoice = {
  create: async (data) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Prepare invoice insert
      const {
        customer, invoice_no, invoice_date, due_date, status, no1, no2,
        sr_no, item_code, item_description_size, item_finish, pcs_per_box,
        extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
        kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
        weight_per_ctn, gst, total, grand_total
      } = data;

      const insertQuery = `
        INSERT INTO sales_invoice
        (customer, invoice_no, invoice_date, due_date, status, no1, no2,
         sr_no, item_code, item_description_size, item_finish, pcs_per_box,
         extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
         kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
         weight_per_ctn, gst, total, grand_total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        customer, invoice_no, invoice_date, due_date, status, no1, no2,
        sr_no, item_code, item_description_size, item_finish, pcs_per_box,
        extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
        kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
        weight_per_ctn, gst, total, grand_total
      ];

      const [result] = await connection.query(insertQuery, values);

      // Update quantity_pcs in sales_orders
      if (item_code && item_finish && total_pcs && total_pcs > 0) {
        const updateQtyQuery = `
          UPDATE sales_orders
          SET quantity_pcs = GREATEST(quantity_pcs - ?, 0)
          WHERE item_code = ?
          AND finish = ?
          AND quantity_pcs > 0
        `;
        await connection.query(updateQtyQuery, [total_pcs, item_code, item_finish]);

        // Additionally update invoice_status to 'pedding'
        const updateStatusQuery = `
          UPDATE sales_orders
          SET invoice_status = 'pedding'
          WHERE item_code = ?
          AND finish = ?
        `;
        await connection.query(updateStatusQuery, [item_code, item_finish]);
      }

      await connection.commit();
      connection.release();
      return { id: result.insertId, ...data };

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM sales_invoice ORDER BY id DESC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM sales_invoice WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id);
    const query = `UPDATE sales_invoice SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    const [rows] = await db.query('SELECT * FROM sales_invoice WHERE id = ?', [id]);
    return rows;
  },

  delete: async (id) => {
    await db.query('DELETE FROM sales_invoice WHERE id = ?', [id]);
  },
  getDistinctCustomerNames: async () => {
  const query = `
    SELECT DISTINCT customer_name 
    FROM sales_orders 
    WHERE customer_name IS NOT NULL AND customer_name != '' 
    ORDER BY customer_name ASC
  `;
  const [rows] = await db.query(query);
  return rows.map(row => row.customer_name);
},

findFinishNoteByCustomerName: async (customerName) => {
  const query = `
    SELECT finish, note
    FROM sales_orders
    WHERE customer_name = ?
  `;
  const [rows] = await db.query(query, [customerName]);
  return rows;
},

findUnfinishedFinishesByCustomerId: async (customerId, code_user) => {
  // Query 1: Get all unfinished sales orders for the customer (this is your original query)
  const salesOrderQuery = `
    SELECT DISTINCT
      finish, 
      kg_box, 
      scrap,
      labour,
      pcs_box,
      note 
    FROM sales_orders 
    WHERE customer_id = ? AND invoice_status != 'completed'
  `;
  
  const [salesOrders] = await db.query(salesOrderQuery, [customerId]);


  // If we didn't find any sales orders, we can stop here.
  if (salesOrders.length === 0) {
    return [];
  }

  // Query 2: Get the single description from inventory_items using the provided code_user
  const descriptionQuery = `
    SELECT description,pic_or_kg,kg_dzn,
      empty_wt,
      actual_wt 
    FROM inventory_items 
    WHERE code_user = ? 
    LIMIT 1
  `;
  const [inventoryRows] = await db.query(descriptionQuery, [customerId]);

  // Get the description from the result, or set it to null if nothing was found.
  const description = inventoryRows.length > 0 ? inventoryRows[0].description : null;
  const picKg = inventoryRows.length > 0 ? inventoryRows[0].pic_or_kg : null;
  const kg_dzn = inventoryRows.length > 0 ? inventoryRows[0].kg_dzn : null;
  const empty_wt = inventoryRows.length > 0 ? inventoryRows[0].empty_wt : null;
  const actual_wt = inventoryRows.length > 0 ? inventoryRows[0].actual_wt : null;

  // Add the description to every sales order object we found earlier.
  const finalResult = salesOrders.map(order => {
    return {
      ...order, // This copies all the original fields from the order
      description: description,
      pic_or_kg:picKg,
      kg_dzn:kg_dzn,
      empty_wt:empty_wt,
      actual_wt:actual_wt // This adds the new description field
    };
  });

  return finalResult;
},
findByInvoiceNo: async (invoiceNo) => {
    const query = 'SELECT * FROM sales_invoice WHERE invoice_no = ?';
    const [rows] = await db.query(query, [invoiceNo]);
    return rows;
  },
  createBatch: async (invoices) => {
    // LOG 4
    console.log('--- MODEL: createBatch function STARTED. ---');
    const connection = await db.getConnection();
    const createdInvoices = [];

    try {
      await connection.beginTransaction();
      // LOG 5
      console.log('--- MODEL: Database transaction BEGAN. ---');

      for (const invoiceData of invoices) {
        const {
          customer, invoice_no, invoice_date, due_date, status, no1, no2,
          sr_no, item_code, item_description_size, item_finish, pcs_per_box,
          extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
          kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
          weight_per_ctn, gst, total, grand_total
        } = invoiceData;

        // 1. INSERT into sales_invoice
        const insertQuery = `
          INSERT INTO sales_invoice
          (customer, invoice_no, invoice_date, due_date, status, no1, no2,
           sr_no, item_code, item_description_size, item_finish, pcs_per_box,
           extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
           kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
           weight_per_ctn, gst, total, grand_total)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          customer, invoice_no, invoice_date, due_date, status, no1, no2,
          sr_no, item_code, item_description_size, item_finish, pcs_per_box,
          extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
          kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
          weight_per_ctn, gst, total, grand_total
        ];
        const [result] = await connection.query(insertQuery, values);

        // 2. UPDATE sales_orders
        if (item_code && item_finish && total_pcs > 0) {
          const updateQtyQuery = `
            UPDATE sales_orders
            SET quantity_pcs = GREATEST(quantity_pcs - ?, 0), invoice_status = 'pedding'
            WHERE item_code = ? AND finish = ? AND quantity_pcs > 0
          `;
          await connection.query(updateQtyQuery, [total_pcs, item_code, item_finish]);
        }
        
        // 3. UPDATE master_items
        if (item_code && total_pcs > 0) {
            const totalKg = parseFloat(net_kg) || 0;
            const updateStockQuery = `
              UPDATE master_items 
              SET stock_quantity = GREATEST(stock_quantity - ?, 0),
                  stock_kg       = GREATEST(COALESCE(stock_kg, 0) - ?, 0)
              WHERE item_code = ?
            `;
            await connection.query(updateStockQuery, [total_pcs, totalKg, item_code]);
        }

        createdInvoices.push({ id: result.insertId, ...invoiceData });
      }

      // LOG 6
      console.log('--- MODEL: All queries successful. Attempting to COMMIT. ---');
      await connection.commit();
      return createdInvoices;

    } catch (error) {
      await connection.rollback();
      // LOG 7 (if an error occurs)
      console.error('--- MODEL: TRANSACTION FAILED & ROLLED BACK ---', error);
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = SalesInvoice;
