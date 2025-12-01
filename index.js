require('dotenv').config(); // MUST be the very first line
const cors = require('cors'); // ✅ ADD THIS LINE
const express = require('express');
const app = express(); // Import the configured Express application
const db = require('./config/db'); // Import the database pool
const userRoutes = require('./route/user_route');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// FIXED CORS IMPLEMENTATION

// ✅ Allow only your frontend domain
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // allow cookies / auth headers
}));

const accountRoutes = require('./route/account_route');
const accountHistoryRoutes = require('./route/account_history_route');
const contactRoutes = require('./route/contact_route');
const receiptRoutes = require('./route/receipt_route');
const paymentRoutes = require('./route/payment_route');
const masterRoutes = require('./route/master_route');
const inventoryRoutes = require('./route/inventory_route');
const stockHistoryRoutes = require('./route/stock_history_route');
const salesOrderRoutes = require('./route/sales_order_route');
const salesInvoiceRoutes = require('./route/sales_invoice_route');
const purchaseInvoiceRoutes = require('./route/purchase_invoice_route');
const finishRoutes = require('./route/finish_route');
const orderStockRoutes = require('./route/order_stock_route');
const invoiceRoutes = require('./route/new_sales_invoice_route');
const transportRoutes = require('./route/trasnport_route');
const cartonInventoryRoutes = require('./route/carton_inventory_route');
const patiRoutes = require('./route/pati_route');

const PORT = process.env.PORT || 3000;

// MOVE ALL ROUTES BEFORE startServer()
app.use('/user', userRoutes);
app.use('/accounts', accountRoutes);
app.use('/account-history', accountHistoryRoutes);
app.use('/contacts', contactRoutes);
app.use('/receipts', receiptRoutes);
app.use('/payments', paymentRoutes);
app.use('/master-items', masterRoutes);
app.use('/inventory-items', inventoryRoutes);
app.use('/stock-history', stockHistoryRoutes);
app.use('/sales-orders', salesOrderRoutes);
app.use('/sales-invoices', salesInvoiceRoutes);
app.use('/purchase-invoices', purchaseInvoiceRoutes);
app.use('/finishes', finishRoutes);
app.use('/order-stock', orderStockRoutes);
app.use('/invoicing', invoiceRoutes);
app.use('/transport', transportRoutes);
app.use('/carton', cartonInventoryRoutes);
app.use('/pati', patiRoutes);

// An async function to connect to the DB and then start the server
const startServer = async () => {
  try {
    // Test the database connection to ensure it's ready
    const connection = await db.getConnection();
    console.log('Database connected successfully.');
    connection.release(); // Return the connection to the pool

    // If the DB connection is successful, start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Stop the application if the DB connection fails
  }
};

// Run the server
startServer();
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const db = require('./config/db');

// const app = express();

// // ✅ Allow only your frontend domain
// app.use(cors({
//   origin: "*",
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true, // allow cookies / auth headers
// }));

// app.options('*', cors()); // handle preflights
// app.use(bodyParser.json());

// // Import your routes
// const userRoutes = require('./route/user_route');
// const accountRoutes = require('./route/account_route');
// const contactRoutes = require('./route/contact_route');
// const receiptRoutes = require('./route/receipt_route');
// const paymentRoutes = require('./route/payment_route');
// const masterRoutes = require('./route/master_route');
// const inventoryRoutes = require('./route/inventory_route');
// const salesOrderRoutes = require('./route/sales_order_route');
// const salesInvoiceRoutes = require('./route/sales_invoice_route');
// const purchaseInvoiceRoutes = require('./route/purchase_invoice_route');
// const finishRoutes = require('./route/finish_route');
// const orderStockRoutes = require('./route/order_stock_route');
// const invoiceRoutes = require('./route/new_sales_invoice_route');
// const transportRoutes = require('./route/trasnport_route');
// const cartonInventoryRoutes = require('./route/carton_inventory_route');
// const patiRoutes = require('./route/pati_route');

// // Register routes
// app.use('/user', userRoutes);
// app.use('/accounts', accountRoutes);
// app.use('/contacts', contactRoutes);
// app.use('/receipts', receiptRoutes);
// app.use('/payments', paymentRoutes);
// app.use('/master-items', masterRoutes);
// app.use('/inventory-items', inventoryRoutes);
// app.use('/sales-orders', salesOrderRoutes);
// app.use('/sales-invoices', salesInvoiceRoutes);
// app.use('/purchase-invoices', purchaseInvoiceRoutes);
// app.use('/finishes', finishRoutes);
// app.use('/order-stock', orderStockRoutes);
// app.use('/invoicing', invoiceRoutes);
// app.use('/transport', transportRoutes);
// app.use('/carton', cartonInventoryRoutes);
// app.use('/pati', patiRoutes);

// const PORT = process.env.PORT || 3000;

// const startServer = async () => {
//   try {
//     const connection = await db.getConnection();
//     console.log('✅ Database connected successfully.');
//     connection.release();

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error('❌ Failed to connect to the database:', error);
//     process.exit(1);
//   }
// };

// startServer();
