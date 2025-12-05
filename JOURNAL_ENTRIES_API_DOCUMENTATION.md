# Journal Entries API Documentation

## Overview
The Journal Entries API allows you to manage daily payments and receipts with payment methods. It includes:
- Payment Methods CRUD operations
- Journal Entries CRUD operations
- Metrics calculation (Total Receipts, Total Payments, Remaining Balance)

## Base URL
`http://localhost:3000`

## Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header and `journal_entries` permission.

---

## Payment Methods API

### 1. Get All Payment Methods
**Endpoint:** `POST /payment-methods/getAll`

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cash",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Bank Transfer",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Create Payment Method
**Endpoint:** `POST /payment-methods/`

**Request Body:**
```json
{
  "name": "UPI"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment method created successfully",
  "data": {
    "id": 7,
    "name": "UPI",
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

### 3. Update Payment Method
**Endpoint:** `POST /payment-methods/update`

**Request Body:**
```json
{
  "id": 7,
  "name": "UPI Payment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment method updated successfully",
  "data": {
    "id": 7,
    "name": "UPI Payment",
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:35:00.000Z"
  }
}
```

### 4. Delete Payment Method
**Endpoint:** `POST /payment-methods/delete`

**Request Body:**
```json
{
  "id": 7
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment method deleted successfully"
}
```

**Note:** Cannot delete payment methods that are used in journal entries.

---

## Journal Entries API

### 1. Create Journal Entry
**Endpoint:** `POST /journal-entries/`

**Request Body:**
```json
{
  "date": "2025-01-15",
  "type": "Receipt",
  "customer_name": "Customer A",
  "method_id": 1,
  "amount": 10000.00,
  "notes": "Invoice Payment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Journal entry created successfully",
  "data": {
    "id": 1,
    "date": "2025-01-15",
    "type": "Receipt",
    "customer_name": "Customer A",
    "method_id": 1,
    "method_name": "Cash",
    "amount": "10000.00",
    "notes": "Invoice Payment",
    "user_id": 1,
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Journal Entries
**Endpoint:** `POST /journal-entries/getAll`

**Request Body (all fields optional):**
```json
{
  "search": "Customer A",
  "type": "Receipt",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "limit": 50
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2025-01-15",
      "type": "Receipt",
      "customer_name": "Customer A",
      "method_id": 1,
      "method_name": "Cash",
      "amount": "10000.00",
      "notes": "Invoice Payment",
      "user_id": 1,
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Journal Entry by ID
**Endpoint:** `POST /journal-entries/getById`

**Request Body:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "date": "2025-01-15",
    "type": "Receipt",
    "customer_name": "Customer A",
    "method_id": 1,
    "method_name": "Cash",
    "amount": "10000.00",
    "notes": "Invoice Payment",
    "user_id": 1,
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Journal Entry
**Endpoint:** `POST /journal-entries/update`

**Request Body (all fields optional except id):**
```json
{
  "id": 1,
  "date": "2025-01-16",
  "type": "Payment",
  "customer_name": "Customer B",
  "method_id": 2,
  "amount": 5000.00,
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Journal entry updated successfully",
  "data": {
    "id": 1,
    "date": "2025-01-16",
    "type": "Payment",
    "customer_name": "Customer B",
    "method_id": 2,
    "method_name": "Bank Transfer",
    "amount": "5000.00",
    "notes": "Updated notes",
    "user_id": 1,
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T11:00:00.000Z"
  }
}
```

### 5. Delete Journal Entry
**Endpoint:** `POST /journal-entries/delete`

**Request Body:**
```json
{
  "id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Journal entry deleted successfully"
}
```

### 6. Get Metrics
**Endpoint:** `POST /journal-entries/getMetrics`

**Request Body (optional date filters):**
```json
{
  "startDate": "2025-01-01",
  "endDate": "2025-01-31"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_receipts": 10000.00,
    "total_payments": 7500.00,
    "remaining_balance": 2500.00
  }
}
```

---

## Setup Instructions

1. **Run the SQL script to create tables:**
   ```bash
   mysql -u your_user -p your_database < database/journal_entries_tables.sql
   ```

2. **Add permission to your user:**
   ```bash
   mysql -u your_user -p your_database < database/add_journal_entries_permission.sql
   ```

3. **Restart the server:**
   ```bash
   npm start
   ```

---

## Field Descriptions

### Payment Methods
- `id`: Auto-increment primary key
- `name`: Unique payment method name (e.g., "Cash", "Bank Transfer")
- `created_at`: Timestamp when created
- `updated_at`: Timestamp when last updated

### Journal Entries
- `id`: Auto-increment primary key
- `date`: Date of the entry (YYYY-MM-DD)
- `type`: Either "Payment" or "Receipt"
- `customer_name`: Name of the customer
- `method_id`: Foreign key to payment_methods table
- `amount`: Decimal amount (must be > 0)
- `notes`: Optional notes/description
- `user_id`: ID of user who created the entry
- `created_at`: Timestamp when created
- `updated_at`: Timestamp when last updated

### Metrics
- `total_receipts`: Sum of all Receipt entries
- `total_payments`: Sum of all Payment entries
- `remaining_balance`: total_receipts - total_payments

---

## Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Error details"
}
```

