# Account History API - cURL Examples

## 📋 Overview

This document provides cURL commands for all Account History API endpoints with example responses.

**Base URL**: `http://localhost:3000/account-history`

**Authentication**: All endpoints require JWT token in Authorization header
**Permission**: `accounts` permission required

---

## 🔑 Authentication

Replace `<YOUR_JWT_TOKEN>` with your actual JWT token in all examples below.

---

## 1. Get Account History by Account ID

### cURL Command

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_id": 1,
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "transaction_type": "CREDIT",
    "limit": 100,
    "offset": 0
  }'
```

### Minimal Request (Only Account ID)

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_id": 1
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "history": [
      {
        "id": 1,
        "account_id": 1,
        "transaction_type": "CREDIT",
        "amount": "5000.00",
        "contact_id": 3,
        "contact_name": "John Doe",
        "contact_type": "Customer",
        "date": "2024-01-15",
        "description": "Payment received from customer",
        "reference": "REF001",
        "receipt_id": 10,
        "payment_id": null,
        "balance_after": "15000.00",
        "user_id": 1,
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z",
        "account_name": "Main Account",
        "account_code": "ACC001",
        "contact_full_name": "John Doe",
        "contact_code": "CUST001"
      },
      {
        "id": 2,
        "account_id": 1,
        "transaction_type": "DEBIT",
        "amount": "2000.00",
        "contact_id": 5,
        "contact_name": "ABC Suppliers",
        "contact_type": "Supplier",
        "date": "2024-01-16",
        "description": "Payment made to supplier",
        "reference": "REF002",
        "receipt_id": null,
        "payment_id": 8,
        "balance_after": "13000.00",
        "user_id": 1,
        "created_at": "2024-01-16T11:00:00.000Z",
        "updated_at": "2024-01-16T11:00:00.000Z",
        "account_name": "Main Account",
        "account_code": "ACC001",
        "contact_full_name": "ABC Suppliers",
        "contact_code": "SUP001"
      }
    ],
    "summary": {
      "account_id": 1,
      "total_credit": "50000.00",
      "total_debit": "20000.00",
      "total_transactions": 25,
      "first_transaction_date": "2024-01-01",
      "last_transaction_date": "2024-12-31",
      "current_balance": "30000.00",
      "net_amount": "30000.00"
    }
  }
}
```

---

## 2. Get Account History by Account Name

### cURL Command

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_name": "NO_1",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "transaction_type": "CREDIT",
    "limit": 100,
    "offset": 0
  }'
```

### Minimal Request (Only Account Name)

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_name": "NO_1"
  }'
```

### Example Response

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
        "customer_name": "John Doe",
        "supplier_name": null,
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
        "customer_name": null,
        "supplier_name": "ABC Suppliers",
        "account_name": "NO_1",
        "account_code": "ACC001"
      }
    ],
    "summary": {
      "account_name": "NO_1",
      "account_id": 1,
      "total_credit": "50000.00",
      "total_debit": "20000.00",
      "total_transactions": 25,
      "first_transaction_date": "2024-01-01",
      "last_transaction_date": "2024-12-31",
      "current_balance": "30000.00",
      "net_amount": "30000.00"
    }
  }
}
```

---

## 3. Get All Account History

### cURL Command

```bash
curl -X POST http://localhost:3000/account-history/getAllAccountHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_id": 1,
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "transaction_type": "CREDIT",
    "contact_id": 5,
    "limit": 100,
    "offset": 0
  }'
```

### Minimal Request (All History)

```bash
curl -X POST http://localhost:3000/account-history/getAllAccountHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{}'
```

### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "account_id": 1,
      "transaction_type": "CREDIT",
      "amount": "5000.00",
      "contact_id": 3,
      "contact_name": "John Doe",
      "contact_type": "Customer",
      "date": "2024-01-15",
      "description": "Payment received",
      "reference": "REF001",
      "receipt_id": 10,
      "payment_id": null,
      "balance_after": "15000.00",
      "user_id": 1,
      "created_at": "2024-01-15T10:30:00.000Z",
      "account_name": "Main Account",
      "account_code": "ACC001",
      "contact_full_name": "John Doe",
      "contact_code": "CUST001"
    },
    {
      "id": 2,
      "account_id": 2,
      "transaction_type": "DEBIT",
      "amount": "2000.00",
      "contact_id": 5,
      "contact_name": "ABC Suppliers",
      "contact_type": "Supplier",
      "date": "2024-01-16",
      "description": "Payment made",
      "reference": "REF002",
      "receipt_id": null,
      "payment_id": 8,
      "balance_after": "8000.00",
      "user_id": 1,
      "created_at": "2024-01-16T11:00:00.000Z",
      "account_name": "NO_2",
      "account_code": "ACC002",
      "contact_full_name": "ABC Suppliers",
      "contact_code": "SUP001"
    }
  ],
  "count": 2
}
```

---

## 4. Get Account Summary

### cURL Command

```bash
curl -X POST http://localhost:3000/account-history/getAccountSummary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_id": 1,
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
  }'
```

### Minimal Request (Only Account ID)

```bash
curl -X POST http://localhost:3000/account-history/getAccountSummary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_id": 1
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "account_id": 1,
    "total_credit": "50000.00",
    "total_debit": "20000.00",
    "total_transactions": 25,
    "first_transaction_date": "2024-01-01",
    "last_transaction_date": "2024-12-31",
    "current_balance": "30000.00",
    "net_amount": "30000.00"
  }
}
```

---

## 📝 Filter Examples

### Get Only CREDIT Transactions (Receipts)

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_name": "NO_1",
    "transaction_type": "CREDIT"
  }'
```

**Response**: Shows only transactions where amount was added (receipts)

---

### Get Only DEBIT Transactions (Payments)

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_name": "NO_1",
    "transaction_type": "DEBIT"
  }'
```

**Response**: Shows only transactions where amount was subtracted (payments)

---

### Get History for Date Range

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_name": "NO_1",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }'
```

**Response**: Shows only transactions in January 2024

---

### Get History with Pagination

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_name": "NO_1",
    "limit": 50,
    "offset": 0
  }'
```

**Response**: Shows first 50 transactions

---

## ⚠️ Error Responses

### Missing Account ID/Name

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{}'
```

**Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Account ID is required"
}
```

### Unauthorized (No Token)

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistory \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": 1
  }'
```

**Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Unauthorized: No token provided."
}
```

### Invalid Token

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token" \
  -d '{
    "account_id": 1
  }'
```

**Response** (403 Forbidden):
```json
{
  "success": false,
  "message": "Forbidden: Invalid token."
}
```

### Server Error

**Response** (500 Internal Server Error):
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Detailed error message"
}
```

---

## 🔧 Using Variables in cURL

### Save Token as Variable

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "account_name": "NO_1"
  }'
```

### Save Account Name as Variable

```bash
TOKEN="your_jwt_token_here"
ACCOUNT_NAME="NO_1"

curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"account_name\": \"$ACCOUNT_NAME\"
  }"
```

---

## 📋 Quick Reference

| Endpoint | Method | Required Field | Description |
|----------|--------|----------------|-------------|
| `/getAccountHistory` | POST | `account_id` | Get history by account ID |
| `/getAccountHistoryByName` | POST | `account_name` | Get history by account name (e.g., "NO_1") |
| `/getAllAccountHistory` | POST | None | Get all history (optional filters) |
| `/getAccountSummary` | POST | `account_id` | Get summary statistics |

---

## 🎯 Common Use Cases

### 1. Get NO_1 Account History (Most Common)

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{"account_name": "NO_1"}'
```

### 2. Get NO_2 Account History

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{"account_name": "NO_2"}'
```

### 3. Get Only Receipts (CREDIT) for NO_1

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_name": "NO_1",
    "transaction_type": "CREDIT"
  }'
```

### 4. Get Only Payments (DEBIT) for NO_1

```bash
curl -X POST http://localhost:3000/account-history/getAccountHistoryByName \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "account_name": "NO_1",
    "transaction_type": "DEBIT"
  }'
```

---

*Replace `<YOUR_JWT_TOKEN>` with your actual JWT token from login response*

