# Inventory Management API - Project Overview

## 📋 Project Summary
A comprehensive Node.js/Express REST API for inventory management with role-based access control, supporting multiple business modules including sales, purchases, inventory tracking, and financial transactions.

## 🛠️ Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MySQL (via mysql2)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Environment**: dotenv
- **CORS**: Enabled for all origins

## 📁 Project Structure
```
inventory_api/
├── config/
│   └── db.js              # MySQL connection pool
├── controller/            # Business logic handlers
├── model/                 # Database query functions
├── route/                 # API route definitions
├── middlewares/           # Auth, permissions, file upload
├── uploads/              # Uploaded files storage
└── index.js              # Application entry point
```

## 🔐 Authentication & Authorization

### Authentication Middleware
- JWT-based authentication
- Token extracted from `Authorization: Bearer <token>` header
- User info attached to `req.user`

### Permission System
- Role-based access control (RBAC)
- Permissions stored in `user_permissions` table
- Permissions embedded in JWT token
- Each module has specific permission requirements

### Available Permissions
- `accounts`
- `contacts`
- `receipts`
- `payments`
- `master_items`
- `inventory_items`
- `sales_orders`
- `sales_invoices`
- `purchase_invoices`
- `transport`

## 📡 API Endpoints

### Base URL
`http://localhost:3000`

---

## 👤 User Management (`/user`)

### POST `/user/register`
- **Auth**: None (public)
- **Body**: `{ user_name, email, password, permissions: [] }`
- **Description**: Register new user with permissions

### POST `/user/login`
- **Auth**: None (public)
- **Body**: `{ email, password }`
- **Response**: `{ token, success, message }`
- **Description**: Login and receive JWT token with permissions

---

## 💰 Account Management (`/accounts`)

### POST `/accounts`
- **Auth**: Required + `accounts` permission
- **Description**: Create new account

### POST `/accounts/getAllAccount`
- **Auth**: Required + `accounts` permission
- **Description**: Get all accounts

### POST `/accounts/updateAccount`
- **Auth**: Required + `accounts` permission
- **Description**: Update account

### POST `/accounts/deleteAccount`
- **Auth**: Required + `accounts` permission
- **Description**: Delete account

---

## 📞 Contact Management (`/contacts`)

### POST `/contacts`
- **Auth**: Required + `contacts` permission
- **Upload**: Single image file
- **Description**: Create contact with image

### POST `/contacts/getAllContact`
- **Auth**: Required + `contacts` permission
- **Description**: Get all contacts

### POST `/contacts/updateContact`
- **Auth**: Required + `contacts` permission
- **Upload**: Single image file
- **Description**: Update contact

### POST `/contacts/deleteContact`
- **Auth**: Required + `contacts` permission
- **Description**: Delete contact

### POST `/contacts/getAllContactCodes`
- **Auth**: Required + `contacts` permission
- **Description**: Get all contact codes

---

## 📦 Master Items (`/master-items`)

### POST `/master-items`
- **Auth**: Required + `master_items` permission
- **Description**: Create master item

### POST `/master-items/getAllMaster`
- **Auth**: Required + `master_items` permission
- **Description**: Get all master items

### POST `/master-items/updateMaster`
- **Auth**: Required + `master_items` permission
- **Description**: Update master item

### POST `/master-items/deleteMaster`
- **Auth**: Required + `master_items` permission
- **Description**: Delete master item

### POST `/master-items/getItemCodes`
- **Auth**: Required + `master_items` permission
- **Description**: Get all item codes

---

## 📊 Inventory Items (`/inventory-items`)

### POST `/inventory-items`
- **Auth**: Required + `inventory_items` permission
- **Description**: Create inventory item

### POST `/inventory-items/getAllInventory`
- **Auth**: Required + `inventory_items` permission
- **Description**: Get all inventory items

### POST `/inventory-items/updateInventory`
- **Auth**: Required + `inventory_items` permission
- **Description**: Update inventory item

### POST `/inventory-items/deleteInventory`
- **Auth**: Required + `inventory_items` permission
- **Description**: Delete inventory item

### POST `/inventory-items/batchUpdateInventory`
- **Auth**: Required + `inventory_items` permission
- **Description**: Batch update multiple items

### POST `/inventory-items/batchDeleteInventory`
- **Auth**: Required + `inventory_items` permission
- **Description**: Batch delete multiple items

### POST `/inventory-items/searchInventoryByItemCode`
- **Auth**: Required + `inventory_items` permission
- **Description**: Search items by item code

### POST `/inventory-items/getItemCodes`
- **Auth**: Required + `inventory_items` permission
- **Description**: Get all item codes

### POST `/inventory-items/getItemByItemCode`
- **Auth**: Required + `inventory_items` permission
- **Description**: Get item by exact item code

---

## 🛒 Sales Orders (`/sales-orders`)

### POST `/sales-orders`
- **Auth**: Required + `sales_orders` permission
- **Description**: Create sales order

### POST `/sales-orders/getAllSalesOrder`
- **Auth**: Required + `sales_orders` permission
- **Description**: Get all sales orders

### POST `/sales-orders/updateSalesOrder`
- **Auth**: Required + `sales_orders` permission
- **Description**: Update sales order

### POST `/sales-orders/deleteSalesOrder`
- **Auth**: Required + `sales_orders` permission
- **Description**: Delete sales order

### POST `/sales-orders/batchUpdateSalesOrder`
- **Auth**: Required + `sales_orders` permission
- **Description**: Batch update sales orders

### POST `/sales-orders/batchDeleteSalesOrder`
- **Auth**: Required + `sales_orders` permission
- **Description**: Batch delete sales orders

### POST `/sales-orders/searchSalesOrderByUserName`
- **Auth**: Required + `sales_orders` permission
- **Description**: Search orders by user name

### POST `/sales-orders/getValidCodeUserList`
- **Auth**: Required + `sales_orders` permission
- **Description**: Get valid code user list

### POST `/sales-orders/getInventoryByCodeUser`
- **Auth**: Required + `sales_orders` permission
- **Description**: Get inventory by code user

### POST `/sales-orders/getValidCodeUserListForSuppliers`
- **Auth**: Required + `sales_orders` permission
- **Description**: Get valid code user list for suppliers

### POST `/sales-orders/getSuppliersCodeName`
- **Auth**: None (public endpoint)
- **Description**: Get suppliers code and name

### POST `/sales-orders/getStockByItemCode`
- **Auth**: Required + `sales_orders` permission
- **Description**: Get stock by item code

---

## 🧾 Sales Invoices (`/sales-invoices`)

### POST `/sales-invoices`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Create sales invoice

### POST `/sales-invoices/getAllSalesInvoice`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Get all sales invoices

### POST `/sales-invoices/updateSalesInvoice`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Update sales invoice

### POST `/sales-invoices/deleteSalesInvoice`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Delete sales invoice

### POST `/sales-invoices/getDistinctCustomerNames`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Get distinct customer names

### POST `/sales-invoices/findFinishNoteByCustomerName`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Find finish note by customer name

### POST `/sales-invoices/getUnfinishedFinishes`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Get unfinished finishes for customer

### POST `/sales-invoices/findInvoiceByNumber`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Find invoice by number

### POST `/sales-invoices/getInvoiceSummary`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Get invoice summary

### POST `/sales-invoices/batchCreate`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Batch create invoices

---

## 🧾 New Sales Invoice (`/invoicing`)

### POST `/invoicing`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Create new invoice

### POST `/invoicing/getAllInvoices`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Get all invoices

### POST `/invoicing/updateInvoice`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Update invoice

### POST `/invoicing/deleteInvoice`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Delete invoice

### POST `/invoicing/getInvoiceSummary`
- **Auth**: Required + `sales_invoices` permission
- **Description**: Get invoice summary

### POST `/invoicing/statement`
- **Auth**: None (public endpoint)
- **Description**: Get statement

---

## 🛍️ Purchase Invoices (`/purchase-invoices`)

### POST `/purchase-invoices`
- **Auth**: Required + `purchase_invoices` permission
- **Description**: Add invoice with items

### POST `/purchase-invoices/getPurchaseInvoice`
- **Auth**: Required + `purchase_invoices` permission
- **Description**: Get all invoices with items

### POST `/purchase-invoices/updatePurchaseInvoice`
- **Auth**: Required + `purchase_invoices` permission
- **Description**: Update invoice

### POST `/purchase-invoices/deletePurchaseInvoice`
- **Auth**: Required + `purchase_invoices` permission
- **Description**: Delete invoice

### POST `/purchase-invoices/getDataFromInventoryItem`
- **Auth**: Required + `purchase_invoices` permission
- **Description**: Get inventory details by code user

### POST `/purchase-invoices/getSummaries`
- **Auth**: Required + `purchase_invoices` permission
- **Description**: Get invoice summaries

### POST `/purchase-invoices/getUserCode`
- **Auth**: Required + `purchase_invoices` permission
- **Description**: Get user code

---

## 💵 Receipts (`/receipts`)

### POST `/receipts`
- **Auth**: Required + `receipts` permission
- **Upload**: Single image file
- **Description**: Create receipt with image

### POST `/receipts/getAllReceipt`
- **Auth**: Required + `receipts` permission
- **Description**: Get all receipts

### POST `/receipts/updateReceipt`
- **Auth**: Required + `receipts` permission
- **Upload**: Single image file
- **Description**: Update receipt

### POST `/receipts/deleteReceipt`
- **Auth**: Required + `receipts` permission
- **Description**: Delete receipt

---

## 💳 Payments (`/payments`)

### POST `/payments`
- **Auth**: Required + `payments` permission
- **Upload**: Single image file
- **Description**: Create payment with image

### POST `/payments/getAllPayment`
- **Auth**: Required + `payments` permission
- **Description**: Get all payments

### POST `/payments/updatePayment`
- **Auth**: Required + `payments` permission
- **Upload**: Single image file
- **Description**: Update payment

### POST `/payments/deletePayment`
- **Auth**: Required + `payments` permission
- **Description**: Delete payment

---

## ✨ Finishes (`/finishes`)

### POST `/finishes`
- **Auth**: Required
- **Description**: Add finish

### POST `/finishes/getFinish`
- **Auth**: Required
- **Description**: Get all finishes

### POST `/finishes/updateFinish`
- **Auth**: Required
- **Description**: Update finish

### POST `/finishes/deleteFinish`
- **Auth**: Required
- **Description**: Delete finish

---

## 📦 Order Stock (`/order-stock`)

### POST `/order-stock`
- **Auth**: Required
- **Description**: Add order stock

### POST `/order-stock/getOrderStock`
- **Auth**: Required
- **Description**: Get order stock

### POST `/order-stock/updateOrderStock`
- **Auth**: Required
- **Description**: Update order stock

### POST `/order-stock/deleteOrderStock`
- **Auth**: Required
- **Description**: Delete order stock

---

## 📦 Carton Inventory (`/carton`)

### POST `/carton/addCarton`
- **Auth**: Required + `master_items` permission
- **Description**: Add carton

### POST `/carton/getCartonNames`
- **Auth**: Required + `master_items` permission
- **Description**: Get carton names

---

## 📋 PATI (`/pati`)

### POST `/pati`
- **Auth**: Required + `master_items` permission
- **Description**: Create PATI

### POST `/pati/getAllPati`
- **Auth**: Required + `master_items` permission
- **Description**: Get all PATI records

### POST `/pati/updatePati`
- **Auth**: Required + `master_items` permission
- **Description**: Update PATI

### POST `/pati/deletePati`
- **Auth**: Required + `master_items` permission
- **Description**: Delete PATI

### POST `/pati/getPatiTypes`
- **Auth**: Required + `master_items` permission
- **Description**: Get PATI types

---

## 🚚 Transport (`/transport`)

### POST `/transport/addTransport`
- **Auth**: Required
- **Description**: Add transport

### POST `/transport/getTransports`
- **Auth**: Required
- **Description**: Get all transports

### POST `/transport/updateTransport`
- **Auth**: Required
- **Description**: Update transport

### POST `/transport/deleteTransport`
- **Auth**: Required
- **Description**: Delete transport

---

## 📁 File Upload

### Configuration
- **Storage**: Local disk (`./uploads/`)
- **Max File Size**: 10MB
- **Allowed Types**: jpeg, jpg, png, gif
- **Naming**: `{fieldname}-{timestamp}{extension}`

### Endpoints with File Upload
- Contacts (single image)
- Receipts (single image)
- Payments (single image)

---

## 🗄️ Database Schema

Based on phpMyAdmin structure, the database includes:

### Core Tables
- `users` - User accounts
- `user_permissions` - User permission mappings
- `accounts` - Account management
- `contacts` - Contact information
- `customer_details` - Customer data
- `supplier_details` - Supplier data

### Inventory Tables
- `master_items` - Master item catalog
- `inventory_items` - Current inventory
- `carton_inventory` - Carton tracking
- `order_stock` - Stock orders
- `shipping_cartons` - Shipping cartons

### Sales Tables
- `sales_orders` - Sales orders
- `sales_invoice` - Sales invoices
- `invoices` - General invoices
- `invoice_items` - Invoice line items

### Purchase Tables
- `purchase_invoices` - Purchase invoices
- `purchase_invoice_items` - Purchase invoice items

### Financial Tables
- `receipts` - Receipt records
- `payments` - Payment records

### Other Tables
- `finishes_table` - Finish tracking
- `pati_table` - PATI records
- `transport` - Transport information

---

## 🔧 Configuration

### Environment Variables (.env)
```env
PORT=3000
DB_HOST=localhost
DB_PORT=8889
DB_USER=root
DB_PASSWORD=root
DB_NAME=inventory
JWT_SECRET=my_key
```

### Database Connection
- Connection pool with 10 max connections
- Auto-reconnect enabled
- Queue limit: 0 (unlimited)

---

## 🚨 Security Features

1. **JWT Authentication**: All protected routes require valid JWT token
2. **Password Hashing**: bcryptjs with salt rounds
3. **Permission-Based Access**: RBAC system
4. **File Upload Validation**: Type and size restrictions
5. **CORS Configuration**: Configurable origin settings

---

## 📝 API Design Patterns

### Request/Response Pattern
- All routes use **POST** method (even for GET operations)
- Request data in request body (not URL parameters)
- Consistent response format: `{ success, message, data }`

### Error Handling
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 409: Conflict (duplicate resources)
- 500: Server Error

---

## 🔍 Key Features

1. **Multi-Module Support**: Sales, Purchases, Inventory, Finance
2. **Batch Operations**: Batch update/delete for inventory and sales orders
3. **Search Functionality**: Search by item code, user name, customer name
4. **Image Upload**: Support for receipts, payments, contacts
5. **Invoice Management**: Multiple invoice systems (sales, purchase, new sales)
6. **Stock Tracking**: Real-time inventory tracking
7. **Financial Tracking**: Receipts and payments with images
8. **Transport Management**: Shipping and logistics
9. **Finish Tracking**: Production finish tracking
10. **PATI System**: Specialized PATI record management

---

## ⚠️ Issues & Recommendations

### Code Quality
1. **Commented Code**: Remove commented code blocks in `index.js` (lines 77-149)
2. **Inconsistent Auth**: Some routes use `router.use(authMiddleware)`, others use inline middleware
3. **Missing Permissions**: Some routes (transport, finishes) don't use permission checks
4. **File Naming**: Typo in `trasnport_route.js` (should be `transport_route.js`)

### Security
1. **CORS**: Currently allows all origins (`origin: "*"`) - should restrict in production
2. **JWT Secret**: Default secret `my_key` should be changed in production
3. **Password Policy**: No password strength validation

### Performance
1. **Database Queries**: Consider adding indexes for frequently searched fields
2. **File Storage**: Consider cloud storage for production
3. **Pagination**: No pagination for list endpoints

### Documentation
1. **API Documentation**: No Swagger/OpenAPI documentation
2. **Request/Response Examples**: Missing for endpoints
3. **Error Codes**: No standardized error code system

---

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Create `.env` file with database credentials
   - Update `JWT_SECRET` for production

3. **Start Server**
   ```bash
   npm start
   ```

4. **Database Setup**
   - Ensure MySQL is running (MAMP on port 8889)
   - Database `inventory` exists
   - Tables are created

---

## 📊 Statistics

- **Total Routes**: ~95+ endpoints
- **Controllers**: 15 modules
- **Models**: 15+ data models
- **Database Tables**: 22 tables
- **File Upload Support**: 3 modules
- **Batch Operations**: 4 modules

---

## 🎯 Next Steps

1. Add API documentation (Swagger)
2. Implement request validation middleware
3. Add pagination to list endpoints
4. Implement rate limiting
5. Add logging system
6. Create unit tests
7. Add database migrations
8. Implement soft deletes
9. Add audit logging
10. Set up CI/CD pipeline

---

*Last Updated: Based on current codebase analysis*

