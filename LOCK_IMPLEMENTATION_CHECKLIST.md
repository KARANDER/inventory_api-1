# Lock Implementation Checklist

## Controllers that need lock checks on CREATE:

### ✅ Already Implemented:

1. **Sales Orders** - `controller/sales_order_controller.js` - `createOrder()` - checks `sales_orders`
2. **Sales Invoices** - `controller/sales_invoice_controller.js` - `createInvoice()` - checks `sales_invoices`
3. **New Sales Invoices** - `controller/new_sales_invoide_controller.js` - `createInvoice()` - checks `sales_invoices`
4. **Receipts** - `controller/receipt_controller.js` - `createReceipt()` - checks `receipts` ✅ JUST ADDED

### ⚠️ Need to Add:

5. **Payments** - `controller/payment_controller.js` - `createPayment()` - needs `payments` check
6. **Customers** - `controller/contact_controller.js` - `createContact()` (type=Customer) - needs `customers` check
7. **Suppliers** - `controller/contact_controller.js` - `createContact()` (type=Supplier) - needs `suppliers` check
8. **Purchase Invoices** - `controller/puchase_invoice_controller.js` - `createInvoice()` - needs `purchase_invoices` check
9. **Inventory Items** - `controller/inventory_controller.js` - `createItem()` - needs `inventory_items` check
10. **Master Items** - `controller/master_controller.js` - `createItem()` - needs `master_items` check
11. **Accounts** - `controller/account_controller.js` - `createAccount()` - needs `accounts` check
12. **Employees** - `controller/employee_controller.js` - `create()` - needs `employees` check
13. **Journal Entries** - `controller/journal_entry_controller.js` - `create()` - needs `journal_entries` check

## Code Pattern to Add:

```javascript
const SalesLock = require("../model/sales_lock_model");

// At the start of create function:
const isLocked = await SalesLock.isLocked("module_name");
if (isLocked) {
  return res.status(403).json({
    success: false,
    message: "Module Name is currently locked. Cannot create records.",
  });
}
```

## Module Name Mapping:

- `payments` → "Payments are currently locked"
- `customers` → "Customers are currently locked"
- `suppliers` → "Suppliers are currently locked"
- `purchase_invoices` → "Purchase Invoices are currently locked"
- `inventory_items` → "Inventory Items are currently locked"
- `master_items` → "Master Product is currently locked"
- `accounts` → "Bank and Cash Accounts are currently locked"
- `employees` → "Employees are currently locked"
- `journal_entries` → "Journal Entries are currently locked"
