# Complete Delete APIs Reference

## All Available Delete APIs

Your system now has BOTH single delete and bulk delete APIs for all major entities.

---

## 1. ACCOUNTS (Bank/Cash)

### Delete Single Account

**Endpoint:** `POST /accounts/deleteAccount`
**Body:** `{"id": 123}`
**Permission:** `accounts`

### Delete All Bank and Cash Accounts

**Endpoint:** `POST /accounts/deleteAllBankCashAccounts`
**Body:** None
**Permission:** `accounts`

---

## 2. RECEIPTS

### Delete Single Receipt

**Endpoint:** `POST /receipts/deleteReceipt`
**Body:** `{"id": 456}`
**Permission:** `receipts`

### Delete All Receipts

**Endpoint:** `POST /receipts/deleteAllReceipts`
**Body:** None
**Permission:** `receipts`

---

## 3. PAYMENTS

### Delete Single Payment

**Endpoint:** `POST /payments/deletePayment`
**Body:** `{"id": 789}`
**Permission:** `payments`

### Delete All Payments

**Endpoint:** `POST /payments/deleteAllPayments`
**Body:** None
**Permission:** `payments`

---

## 4. CUSTOMERS

### Delete Single Customer

**Endpoint:** `POST /contacts/deleteContact`
**Body:** `{"id": 111}`
**Permission:** `contacts`

### Delete All Customers

**Endpoint:** `POST /contacts/deleteAllCustomers`
**Body:** None
**Permission:** `contacts`

---

## 5. SUPPLIERS

### Delete Single Supplier

**Endpoint:** `POST /contacts/deleteContact`
**Body:** `{"id": 222}`
**Permission:** `contacts`

### Delete All Suppliers

**Endpoint:** `POST /contacts/deleteAllSuppliers`
**Body:** None
**Permission:** `contacts`

---

## 6. MASTER DELETE

### Delete All Database Data

**Endpoint:** `POST /database/deleteAllData`
**Body:** None
**Permission:** `admin`
**WARNING:** Deletes ALL data except users and permissions!

---

## Quick Reference Table

| Entity         | Single Delete                  | Bulk Delete                                |
| -------------- | ------------------------------ | ------------------------------------------ |
| **Account**    | `POST /accounts/deleteAccount` | `POST /accounts/deleteAllBankCashAccounts` |
| **Receipt**    | `POST /receipts/deleteReceipt` | `POST /receipts/deleteAllReceipts`         |
| **Payment**    | `POST /payments/deletePayment` | `POST /payments/deleteAllPayments`         |
| **Customer**   | `POST /contacts/deleteContact` | `POST /contacts/deleteAllCustomers`        |
| **Supplier**   | `POST /contacts/deleteContact` | `POST /contacts/deleteAllSuppliers`        |
| **Everything** | N/A                            | `POST /database/deleteAllData`             |

---

## CURL Examples

### Delete Single Account

```bash
curl -X POST http://localhost:3000/accounts/deleteAccount \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id": 123}'
```

### Delete All Bank/Cash Accounts

```bash
curl -X POST http://localhost:3000/accounts/deleteAllBankCashAccounts \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

### Delete Single Receipt

```bash
curl -X POST http://localhost:3000/receipts/deleteReceipt \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id": 456}'
```

### Delete All Receipts

```bash
curl -X POST http://localhost:3000/receipts/deleteAllReceipts \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

### Delete Single Payment

```bash
curl -X POST http://localhost:3000/payments/deletePayment \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id": 789}'
```

### Delete All Payments

```bash
curl -X POST http://localhost:3000/payments/deleteAllPayments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

### Delete Single Customer

```bash
curl -X POST http://localhost:3000/contacts/deleteContact \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id": 111}'
```

### Delete All Customers

```bash
curl -X POST http://localhost:3000/contacts/deleteAllCustomers \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

### Delete Single Supplier

```bash
curl -X POST http://localhost:3000/contacts/deleteContact \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id": 222}'
```

### Delete All Suppliers

```bash
curl -X POST http://localhost:3000/contacts/deleteAllSuppliers \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

### Delete All Database Data

```bash
curl -X POST http://localhost:3000/database/deleteAllData \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

---

## Response Format

### Success Response (Single Delete)

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### Success Response (Bulk Delete)

```json
{
  "success": true,
  "message": "Successfully deleted 50 receipts",
  "deletedCount": 50
}
```

### Error Response

```json
{
  "success": false,
  "message": "Server Error",
  "error": "Detailed error message"
}
```

---

## Important Notes

⚠️ **All delete operations are PERMANENT and cannot be undone!**

✅ **Features:**

- All operations logged in `user_activity` table
- Receipts/Payments automatically reverse account balances
- Foreign key relationships handled properly
- Requires valid JWT token and appropriate permissions
- Transaction-based for data integrity

🔒 **Security:**

- Each endpoint requires specific permission
- Master delete requires `admin` permission
- All operations are audited

---

## What Was Added

### New Bulk Delete APIs:

1. ✅ Delete All Bank/Cash Accounts
2. ✅ Delete All Receipts
3. ✅ Delete All Payments
4. ✅ Delete All Customers
5. ✅ Delete All Suppliers (NEW!)
6. ✅ Master Delete All Data

### Existing Single Delete APIs:

1. ✅ Delete Single Account (already existed)
2. ✅ Delete Single Receipt (already existed)
3. ✅ Delete Single Payment (already existed)
4. ✅ Delete Single Contact/Customer/Supplier (already existed)

---

## Testing Checklist

- [ ] Test single account delete
- [ ] Test bulk account delete
- [ ] Test single receipt delete
- [ ] Test bulk receipt delete
- [ ] Test single payment delete
- [ ] Test bulk payment delete
- [ ] Test single customer delete
- [ ] Test bulk customer delete
- [ ] Test single supplier delete
- [ ] Test bulk supplier delete
- [ ] Test master delete (in dev environment only!)
- [ ] Verify activity logs
- [ ] Verify account balances are correct
- [ ] Test with invalid tokens
- [ ] Test with insufficient permissions

---

## Summary

You now have **complete delete functionality** for:

- ✅ Accounts (single + bulk)
- ✅ Receipts (single + bulk)
- ✅ Payments (single + bulk)
- ✅ Customers (single + bulk)
- ✅ Suppliers (single + bulk)
- ✅ Master delete all data

All APIs are ready to use!
