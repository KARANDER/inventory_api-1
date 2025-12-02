# Account History System - Setup Guide

## 📋 Overview

The Account History system automatically tracks all account transactions:
- **Receipts** → Add money to account (CREDIT)
- **Payments** → Subtract money from account (DEBIT)

Each transaction records:
- Account ID
- Transaction type (CREDIT/DEBIT)
- Amount
- Customer/Supplier information
- Date
- Description and reference
- Balance after transaction

---

## 🗄️ Database Setup

### Step 1: Create the Table

1. Open **phpMyAdmin** (http://localhost:8888/phpMyAdmin5)
2. Select the **`inventory`** database
3. Go to the **SQL** tab
4. Copy and paste the SQL from `database/account_history_table.sql`
5. Click **Go** to execute

**OR** run this SQL directly:

```sql
CREATE TABLE IF NOT EXISTS `account_history` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `account_id` INT(11) NOT NULL,
  `transaction_type` ENUM('CREDIT', 'DEBIT') NOT NULL COMMENT 'CREDIT = Receipt (money added), DEBIT = Payment (money subtracted)',
  `amount` DECIMAL(15, 2) NOT NULL,
  `contact_id` INT(11) DEFAULT NULL COMMENT 'ID from contacts table (customer or supplier)',
  `contact_name` VARCHAR(255) DEFAULT NULL COMMENT 'Name of customer/supplier for easy display',
  `contact_type` VARCHAR(50) DEFAULT NULL COMMENT 'Customer or Supplier',
  `date` DATE NOT NULL,
  `description` TEXT DEFAULT NULL,
  `reference` VARCHAR(255) DEFAULT NULL,
  `receipt_id` INT(11) DEFAULT NULL COMMENT 'Link to receipts table if transaction is from receipt',
  `payment_id` INT(11) DEFAULT NULL COMMENT 'Link to payments table if transaction is from payment',
  `balance_after` DECIMAL(15, 2) DEFAULT NULL COMMENT 'Account balance after this transaction',
  `user_id` INT(11) DEFAULT NULL COMMENT 'User who created the transaction',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_account_id` (`account_id`),
  KEY `idx_contact_id` (`contact_id`),
  KEY `idx_date` (`date`),
  KEY `idx_transaction_type` (`transaction_type`),
  KEY `idx_receipt_id` (`receipt_id`),
  KEY `idx_payment_id` (`payment_id`),
  CONSTRAINT `fk_account_history_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_account_history_contact` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_account_history_receipt` FOREIGN KEY (`receipt_id`) REFERENCES `receipts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_account_history_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create indexes for better performance
CREATE INDEX `idx_account_date` ON `account_history` (`account_id`, `date`);
CREATE INDEX `idx_account_type` ON `account_history` (`account_id`, `transaction_type`);
```

### Step 2: Verify Table Creation

Run this query to verify:

```sql
SELECT * FROM account_history LIMIT 10;
```

---

## 🔄 Automatic History Tracking

The system **automatically** creates history records when:

### ✅ Receipt Created
- Creates **CREDIT** entry
- Adds amount to account balance
- Records customer information
- Stores balance after transaction

### ✅ Payment Created
- Creates **DEBIT** entry
- Subtracts amount from account balance
- Records supplier information
- Stores balance after transaction

### ✅ Receipt Deleted
- Deletes history record
- Reverses account balance (subtracts the amount)

### ✅ Payment Deleted
- Deletes history record
- Reverses account balance (adds back the amount)

---

## 📡 API Endpoints

### Base URL
`http://localhost:3000/account-history`

All endpoints require:
- **Authentication**: JWT token in `Authorization: Bearer <token>` header
- **Permission**: `accounts` permission

---

### 1. Get Account History

**Endpoint**: `POST /account-history/getAccountHistory`

**Request Body**:
```json
{
  "account_id": 1,
  "start_date": "2024-01-01",      // Optional: Filter from date
  "end_date": "2024-12-31",         // Optional: Filter to date
  "transaction_type": "CREDIT",    // Optional: "CREDIT" or "DEBIT"
  "contact_id": 5,                  // Optional: Filter by customer/supplier
  "limit": 100,                     // Optional: Number of records (default: 100)
  "offset": 0                       // Optional: Pagination offset (default: 0)
}
```

**Response**:
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

### 2. Get All Account History

**Endpoint**: `POST /account-history/getAllAccountHistory`

**Request Body**:
```json
{
  "account_id": 1,                  // Optional: Filter by account
  "start_date": "2024-01-01",      // Optional
  "end_date": "2024-12-31",        // Optional
  "transaction_type": "CREDIT",    // Optional
  "contact_id": 5,                 // Optional
  "limit": 100,                     // Optional
  "offset": 0                      // Optional
}
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "account_id": 1,
      "transaction_type": "CREDIT",
      "amount": "5000.00",
      "contact_name": "John Doe",
      "date": "2024-01-15",
      "account_name": "Main Account",
      ...
    }
  ],
  "count": 25
}
```

---

### 3. Get Account Summary

**Endpoint**: `POST /account-history/getAccountSummary`

**Request Body**:
```json
{
  "account_id": 1,
  "start_date": "2024-01-01",      // Optional
  "end_date": "2024-12-31"         // Optional
}
```

**Response**:
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

## 📊 Example Usage

### Example 1: Get all transactions for an account

```javascript
// Request
POST /account-history/getAccountHistory
Headers: {
  "Authorization": "Bearer <your_token>",
  "Content-Type": "application/json"
}
Body: {
  "account_id": 1
}

// Response shows all transactions with summary
```

### Example 2: Get only credits (receipts) for a date range

```javascript
// Request
POST /account-history/getAccountHistory
Body: {
  "account_id": 1,
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "transaction_type": "CREDIT"
}

// Response shows only receipt transactions in January
```

### Example 3: Get transactions from a specific customer

```javascript
// Request
POST /account-history/getAccountHistory
Body: {
  "account_id": 1,
  "contact_id": 5
}

// Response shows all transactions with customer ID 5
```

### Example 4: Get account summary for the year

```javascript
// Request
POST /account-history/getAccountSummary
Body: {
  "account_id": 1,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31"
}

// Response shows total credits, debits, and current balance
```

---

## 🔍 Query Examples (Direct SQL)

### Get all transactions for account ID 1
```sql
SELECT * FROM account_history 
WHERE account_id = 1 
ORDER BY date DESC;
```

### Get total credits and debits for an account
```sql
SELECT 
  SUM(CASE WHEN transaction_type = 'CREDIT' THEN amount ELSE 0 END) as total_credit,
  SUM(CASE WHEN transaction_type = 'DEBIT' THEN amount ELSE 0 END) as total_debit
FROM account_history 
WHERE account_id = 1;
```

### Get transactions by customer
```sql
SELECT * FROM account_history 
WHERE account_id = 1 
  AND contact_id = 5 
  AND contact_type = 'Customer'
ORDER BY date DESC;
```

### Get transactions in date range
```sql
SELECT * FROM account_history 
WHERE account_id = 1 
  AND date BETWEEN '2024-01-01' AND '2024-12-31'
ORDER BY date DESC;
```

---

## ⚠️ Important Notes

1. **Automatic Tracking**: History is created automatically when receipts/payments are created
2. **Balance Tracking**: Each transaction stores the account balance after the transaction
3. **Cascade Delete**: If an account is deleted, all history is deleted (CASCADE)
4. **Soft Delete**: If a contact is deleted, history remains but contact_id becomes NULL
5. **Update Operations**: Currently, updating receipts/payments doesn't update history (future enhancement)

---

## 🚀 Testing

1. **Create a Receipt**:
   ```bash
   POST /receipts
   {
     "account_id": 1,
     "amount": 5000,
     "contact_id": 3,
     "date": "2024-01-15",
     "description": "Payment received"
   }
   ```

2. **Check History**:
   ```bash
   POST /account-history/getAccountHistory
   {
     "account_id": 1
   }
   ```

3. **Verify**: You should see a CREDIT entry with the receipt details

---

## 📝 Files Created/Modified

### New Files:
- ✅ `database/account_history_table.sql` - SQL for table creation
- ✅ `model/account_history_model.js` - Database operations
- ✅ `controller/account_history_controller.js` - API handlers
- ✅ `route/account_history_route.js` - Route definitions

### Modified Files:
- ✅ `model/receipt_model.js` - Added history tracking on create/delete
- ✅ `model/payment_model.js` - Added history tracking on create/delete
- ✅ `index.js` - Added account history route

---

## 🎯 Next Steps

1. ✅ Run the SQL to create the table
2. ✅ Test creating a receipt (should create history)
3. ✅ Test creating a payment (should create history)
4. ✅ Test the API endpoints
5. ✅ Verify history records in database

---

*System is ready to use! All receipts and payments will automatically create account history records.*

