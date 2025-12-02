# Account History by Account Name - API Guide

## 📋 Overview

Get account history filtered by account name (e.g., "NO_1", "NO_2") with:
- **CREDIT (Amount Added)**: Shows customer name
- **DEBIT (Amount Minus)**: Shows supplier name
- Amount, Date, and all transaction details

---

## 🔌 API Endpoint

**Endpoint**: `POST /account-history/getAccountHistoryByName`

**Authentication**: Required (JWT token)
**Permission**: `accounts`

---

## 📥 Request Body

```json
{
  "account_name": "NO_1",
  "start_date": "2024-01-01",      // Optional: Filter from date
  "end_date": "2024-12-31",        // Optional: Filter to date
  "transaction_type": "CREDIT",    // Optional: "CREDIT" or "DEBIT"
  "limit": 100,                     // Optional: Number of records (default: 100)
  "offset": 0                       // Optional: Pagination offset (default: 0)
}
```

### Required Fields
- `account_name` - The name of the account (e.g., "NO_1", "NO_2")

### Optional Fields
- `start_date` - Filter transactions from this date (YYYY-MM-DD)
- `end_date` - Filter transactions to this date (YYYY-MM-DD)
- `transaction_type` - Filter by "CREDIT" or "DEBIT"
- `limit` - Number of records to return (default: 100)
- `offset` - Pagination offset (default: 0)

---

## 📤 Response Format

```json
{
  "success": true,
  "data": {
    "account_name": "NO_1",
    "history": [
      {
        "id": 1,
        "transaction_type": "CREDIT",
        "amount": 5000.00,
        "date": "2024-01-15",
        "description": "Payment received from customer",
        "reference": "REF001",
        "balance_after": 15000.00,
        "customer_name": "John Doe",        // ✅ Shows for CREDIT (amount added)
        "supplier_name": null,              // null for CREDIT
        "account_name": "NO_1",
        "account_code": "ACC001"
      },
      {
        "id": 2,
        "transaction_type": "DEBIT",
        "amount": 2000.00,
        "date": "2024-01-16",
        "description": "Payment made to supplier",
        "reference": "REF002",
        "balance_after": 13000.00,
        "customer_name": null,              // null for DEBIT
        "supplier_name": "ABC Suppliers",   // ✅ Shows for DEBIT (amount minus)
        "account_name": "NO_1",
        "account_code": "ACC001"
      }
    ],
    "summary": {
      "account_name": "NO_1",
      "account_id": 1,
      "total_credit": 50000.00,
      "total_debit": 20000.00,
      "total_transactions": 25,
      "first_transaction_date": "2024-01-01",
      "last_transaction_date": "2024-12-31",
      "current_balance": 30000.00,
      "net_amount": 30000.00
    }
  }
}
```

---

## 📊 Response Fields Explained

### History Array Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | History record ID |
| `transaction_type` | string | "CREDIT" (amount added) or "DEBIT" (amount minus) |
| `amount` | number | Transaction amount |
| `date` | string | Transaction date (YYYY-MM-DD) |
| `description` | string | Transaction description |
| `reference` | string | Reference number |
| `balance_after` | number | Account balance after this transaction |
| `customer_name` | string/null | **Customer name (only for CREDIT)** |
| `supplier_name` | string/null | **Supplier name (only for DEBIT)** |
| `account_name` | string | Account name (e.g., "NO_1") |
| `account_code` | string | Account code |

### Summary Fields

| Field | Type | Description |
|-------|------|-------------|
| `account_name` | string | Account name |
| `account_id` | number | Account ID |
| `total_credit` | number | Total amount added (all CREDIT transactions) |
| `total_debit` | number | Total amount subtracted (all DEBIT transactions) |
| `total_transactions` | number | Total number of transactions |
| `first_transaction_date` | string | Date of first transaction |
| `last_transaction_date` | string | Date of last transaction |
| `current_balance` | number | Current account balance |
| `net_amount` | number | Net amount (total_credit - total_debit) |

---

## 💡 Usage Examples

### Example 1: Get all history for "NO_1" account

```javascript
POST /account-history/getAccountHistoryByName
Headers: {
  "Authorization": "Bearer <your_token>",
  "Content-Type": "application/json"
}
Body: {
  "account_name": "NO_1"
}
```

**Response**: Shows all transactions with customer names for CREDIT and supplier names for DEBIT

---

### Example 2: Get only CREDIT transactions (amount added) for "NO_1"

```javascript
POST /account-history/getAccountHistoryByName
Body: {
  "account_name": "NO_1",
  "transaction_type": "CREDIT"
}
```

**Response**: Shows only receipts/credits with customer names

---

### Example 3: Get only DEBIT transactions (amount minus) for "NO_1"

```javascript
POST /account-history/getAccountHistoryByName
Body: {
  "account_name": "NO_1",
  "transaction_type": "DEBIT"
}
```

**Response**: Shows only payments/debits with supplier names

---

### Example 4: Get history for date range

```javascript
POST /account-history/getAccountHistoryByName
Body: {
  "account_name": "NO_1",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

**Response**: Shows transactions in January 2024

---

### Example 5: Get history with pagination

```javascript
POST /account-history/getAccountHistoryByName
Body: {
  "account_name": "NO_1",
  "limit": 50,
  "offset": 0
}
```

**Response**: Shows first 50 transactions

---

## 🎯 Key Features

✅ **Filter by Account Name**: Use account name instead of account ID
✅ **Customer Names**: Automatically shown for CREDIT transactions (when amount added)
✅ **Supplier Names**: Automatically shown for DEBIT transactions (when amount minus)
✅ **Date Filtering**: Filter by date range
✅ **Transaction Type Filtering**: Filter by CREDIT or DEBIT
✅ **Summary Statistics**: Get totals and current balance
✅ **Pagination**: Support for large datasets

---

## 📝 Notes

1. **Account Name**: Must match exactly (case-sensitive) with the account name in the database
2. **Customer Name**: Only populated for CREDIT transactions (receipts)
3. **Supplier Name**: Only populated for DEBIT transactions (payments)
4. **Null Values**: `customer_name` is null for DEBIT, `supplier_name` is null for CREDIT
5. **Ordering**: Results are ordered by date (newest first)

---

## 🔍 Response Logic

- **CREDIT (Amount Added)**:
  - `customer_name` = Contact name (if from customer)
  - `supplier_name` = null

- **DEBIT (Amount Minus)**:
  - `customer_name` = null
  - `supplier_name` = Contact name (if to supplier)

---

## ⚠️ Error Responses

### Missing Account Name
```json
{
  "success": false,
  "message": "Account name is required (e.g., \"NO_1\")"
}
```

### Account Not Found
```json
{
  "success": true,
  "data": {
    "account_name": "NO_1",
    "history": [],
    "summary": null
  }
}
```

### Server Error
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Error message details"
}
```

---

*Use this endpoint to get account history filtered by account name with customer/supplier names automatically displayed based on transaction type.*

