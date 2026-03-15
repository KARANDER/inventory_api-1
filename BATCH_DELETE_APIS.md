# Batch Delete APIs - Complete Reference

## Overview

Batch delete APIs allow you to delete multiple selected items by providing an array of IDs. This matches the pattern used in your Master Items, Sales Orders, and Inventory pages.

---

## Request Format

All batch delete APIs use the same request format:

```json
{
  "ids": [1, 2, 3, 4, 5]
}
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "deletedCount": 5,
  "failed": []
}
```

### Partial Success Response

```json
{
  "success": true,
  "deletedCount": 3,
  "failed": [
    { "id": 4, "message": "Account not found" },
    { "id": 5, "message": "Foreign key constraint error" }
  ]
}
```

### Error Response

```json
{
  "success": false,
  "message": "Request body must contain ids array."
}
```

---

## 1. Batch Delete Accounts

**Endpoint:** `POST /accounts/batchDeleteAccounts`

**Permission:** `accounts`

**Request Body:**

```json
{
  "ids": [1, 2, 3]
}
```

**CURL Example:**

```bash
curl -X POST http://localhost:3000/accounts/batchDeleteAccounts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ids": [1, 2, 3]}'
```

---

## 2. Batch Delete Receipts

**Endpoint:** `POST /receipts/batchDeleteReceipts`

**Permission:** `receipts`

**Request Body:**

```json
{
  "ids": [10, 11, 12]
}
```

**CURL Example:**

```bash
curl -X POST http://localhost:3000/receipts/batchDeleteReceipts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ids": [10, 11, 12]}'
```

**Notes:**

- Automatically reverses account balances for each receipt
- Deletes associated account_history records

---

## 3. Batch Delete Payments

**Endpoint:** `POST /payments/batchDeletePayments`

**Permission:** `payments`

**Request Body:**

```json
{
  "ids": [20, 21, 22]
}
```

**CURL Example:**

```bash
curl -X POST http://localhost:3000/payments/batchDeletePayments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ids": [20, 21, 22]}'
```

**Notes:**

- Automatically reverses account balances for each payment
- Deletes associated account_history records

---

## 4. Batch Delete Contacts (Customers/Suppliers)

**Endpoint:** `POST /contacts/batchDeleteContacts`

**Permission:** `contacts`

**Request Body:**

```json
{
  "ids": [30, 31, 32]
}
```

**CURL Example:**

```bash
curl -X POST http://localhost:3000/contacts/batchDeleteContacts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ids": [30, 31, 32]}'
```

**Notes:**

- Works for both customers and suppliers
- Deletes associated customer_details or supplier_details records

---

## Complete API Summary

| Entity       | Single Delete                  | Batch Delete                         | Delete All                                                  |
| ------------ | ------------------------------ | ------------------------------------ | ----------------------------------------------------------- |
| **Accounts** | `POST /accounts/deleteAccount` | `POST /accounts/batchDeleteAccounts` | `POST /accounts/deleteAllBankCashAccounts`                  |
| **Receipts** | `POST /receipts/deleteReceipt` | `POST /receipts/batchDeleteReceipts` | `POST /receipts/deleteAllReceipts`                          |
| **Payments** | `POST /payments/deletePayment` | `POST /payments/batchDeletePayments` | `POST /payments/deleteAllPayments`                          |
| **Contacts** | `POST /contacts/deleteContact` | `POST /contacts/batchDeleteContacts` | `POST /contacts/deleteAllCustomers` or `deleteAllSuppliers` |

---

## Comparison: Single vs Batch vs Delete All

### Single Delete

- **Use Case:** Delete one specific item
- **Request:** `{"id": 123}`
- **Example:** User clicks delete button on one row

### Batch Delete (NEW!)

- **Use Case:** Delete multiple selected items
- **Request:** `{"ids": [1, 2, 3, 4, 5]}`
- **Example:** User selects checkboxes and clicks "Delete Selected"

### Delete All

- **Use Case:** Delete all items of a type
- **Request:** No body required
- **Example:** User clicks "Delete All Receipts" button

---

## Features

✅ **Transaction Safety:** Each delete is handled individually with error tracking
✅ **Partial Success:** Returns count of successful deletes and list of failures
✅ **Activity Logging:** Each deletion logged separately in user_activity table
✅ **Balance Reversal:** Receipts and payments automatically reverse account balances
✅ **Foreign Key Handling:** Properly handles related records

---

## Error Handling

### Invalid Request

```json
{
  "success": false,
  "message": "Request body must contain ids array."
}
```

### Empty Array

```json
{
  "success": false,
  "message": "Request body must contain ids array."
}
```

### Partial Failure

```json
{
  "success": true,
  "deletedCount": 2,
  "failed": [{ "id": 3, "message": "Account not found" }]
}
```

---

## Frontend Integration Example

### JavaScript/React Example

```javascript
// Delete selected items
const deleteSelected = async (selectedIds) => {
  try {
    const response = await fetch(
      "http://localhost:3000/receipts/batchDeleteReceipts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      },
    );

    const result = await response.json();

    if (result.success) {
      console.log(`Deleted ${result.deletedCount} items`);
      if (result.failed.length > 0) {
        console.log(
          `Failed to delete ${result.failed.length} items:`,
          result.failed,
        );
      }
      // Refresh your data table
      fetchData();
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Usage
const selectedIds = [1, 2, 3, 4, 5];
deleteSelected(selectedIds);
```

---

## Testing Checklist

- [ ] Test batch delete with valid IDs
- [ ] Test batch delete with empty array
- [ ] Test batch delete with non-existent IDs
- [ ] Test batch delete with mixed valid/invalid IDs
- [ ] Verify activity logs for each deletion
- [ ] Verify account balances are correct (receipts/payments)
- [ ] Test with invalid JWT token
- [ ] Test with insufficient permissions
- [ ] Verify foreign key constraints are handled

---

## Important Notes

⚠️ **All delete operations are PERMANENT and cannot be undone!**

✅ **Best Practices:**

1. Always show confirmation dialog before batch delete
2. Display count of selected items to user
3. Handle partial failures gracefully in UI
4. Refresh data table after successful deletion
5. Show detailed error messages for failed items

---

## What Was Added

### New Batch Delete APIs (4 endpoints):

1. ✅ `POST /accounts/batchDeleteAccounts`
2. ✅ `POST /receipts/batchDeleteReceipts`
3. ✅ `POST /payments/batchDeletePayments`
4. ✅ `POST /contacts/batchDeleteContacts`

### Pattern Matches:

- Same structure as existing batch deletes in:
  - Master Items (`/master-items/batchDelete`)
  - Sales Orders (`/sales-orders/batchDeleteSalesOrder`)
  - Inventory Items (`/inventory-items/batchDeleteInventory`)
  - Purchase Invoices (`/purchase-invoices/batchDeletePurchaseInvoices`)
  - Sales Invoices (`/invoicing/batchDeleteInvoices`)
  - Carton Inventory (`/carton/batchDelete`)

---

## Summary

You now have **THREE types of delete operations** for Accounts, Receipts, Payments, and Contacts:

1. **Single Delete** - Delete one item by ID
2. **Batch Delete** - Delete multiple selected items by IDs (NEW!)
3. **Delete All** - Delete all items of a type

All APIs follow the same pattern as your existing batch delete implementations!
