# How to Add Lock Checks to Remaining Controllers

## ✅ Already Done:

- Sales Orders
- Sales Invoices
- Receipts
- Payments

## 🔧 Need to Add:

### 1. Purchase Invoices

**File:** `controller/puchase_invoice_controller.js`
**Function:** `createInvoice`
**Add after line 1:**

```javascript
const SalesLock = require("../model/sales_lock_model");
```

**Add at start of createInvoice function:**

```javascript
const isLocked = await SalesLock.isLocked("purchase_invoices");
if (isLocked) {
  return res.status(403).json({
    success: false,
    message:
      "Purchase Invoices are currently locked. Cannot create purchase invoices.",
  });
}
```

### 2. Contacts (Customers & Suppliers)

**File:** `controller/contact_controller.js`
**Function:** `createContact`
**Add after line 1:**

```javascript
const SalesLock = require("../model/sales_lock_model");
```

**Add at start of createContact function:**

```javascript
// Check lock based on contact type
const contactType = req.body.type;
if (contactType === "Customer") {
  const isLocked = await SalesLock.isLocked("customers");
  if (isLocked) {
    return res.status(403).json({
      success: false,
      message: "Customers are currently locked. Cannot create customers.",
    });
  }
} else if (contactType === "Supplier") {
  const isLocked = await SalesLock.isLocked("suppliers");
  if (isLocked) {
    return res.status(403).json({
      success: false,
      message: "Suppliers are currently locked. Cannot create suppliers.",
    });
  }
}
```

### 3. Inventory Items

**File:** `controller/inventory_controller.js`
**Function:** `createItem`
**Add after line 1:**

```javascript
const SalesLock = require("../model/sales_lock_model");
```

**Add at start of createItem function:**

```javascript
const isLocked = await SalesLock.isLocked("inventory_items");
if (isLocked) {
  return res.status(403).json({
    success: false,
    message:
      "Inventory Items are currently locked. Cannot create inventory items.",
  });
}
```

### 4. Master Items

**File:** `controller/master_controller.js`
**Function:** `createItem`
**Add after line 1:**

```javascript
const SalesLock = require("../model/sales_lock_model");
```

**Add at start of createItem function:**

```javascript
const isLocked = await SalesLock.isLocked("master_items");
if (isLocked) {
  return res.status(403).json({
    success: false,
    message: "Master Product is currently locked. Cannot create master items.",
  });
}
```

### 5. Accounts

**File:** `controller/account_controller.js`
**Function:** `createAccount`
**Add after line 1:**

```javascript
const SalesLock = require("../model/sales_lock_model");
```

**Add at start of createAccount function:**

```javascript
const isLocked = await SalesLock.isLocked("accounts");
if (isLocked) {
  return res.status(403).json({
    success: false,
    message:
      "Bank and Cash Accounts are currently locked. Cannot create accounts.",
  });
}
```

### 6. Employees

**File:** `controller/employee_controller.js`
**Function:** `create`
**Add after line 1:**

```javascript
const SalesLock = require("../model/sales_lock_model");
```

**Add at start of create function:**

```javascript
const isLocked = await SalesLock.isLocked("employees");
if (isLocked) {
  return res.status(403).json({
    success: false,
    message: "Employees are currently locked. Cannot create employees.",
  });
}
```

### 7. Journal Entries

**File:** `controller/journal_entry_controller.js`
**Function:** `create`
**Add after line 1:**

```javascript
const SalesLock = require("../model/sales_lock_model");
```

**Add at start of create function:**

```javascript
const isLocked = await SalesLock.isLocked("journal_entries");
if (isLocked) {
  return res.status(403).json({
    success: false,
    message:
      "Journal Entries are currently locked. Cannot create journal entries.",
  });
}
```

## Summary:

Add these checks to 7 more controllers and all CREATE operations will respect the lock system!
