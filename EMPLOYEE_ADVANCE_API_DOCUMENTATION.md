# Employee Advance Payment API Documentation

## Overview
This API allows you to manage employee advance payments independently from salary. You can:
- **Give advances** to employees (amount, date, reason)
- **Track repayments** separately (amount, date, notes)
- **View complete history** of advances and repayments
- **Monitor remaining balance** for each advance

---

## Database Setup

Before using the API, run this SQL file in your database:

```sql
-- File: database/employee_advance_table.sql
-- This creates:
-- 1. employee_advances table (main advance records)
-- 2. employee_advance_repayments table (track repayments)
-- 3. Indexes for performance
-- 4. View for employee_advance_summary
```

---

## API Endpoints

### 1. Create an Advance Payment
**Create a new advance for an employee (e.g., giving Karan ₹5000)**

```
POST /employee-advances/create
```

#### Request Headers:
```
Content-Type: application/json
Authorization: Bearer <YOUR_TOKEN>
```

#### Request Body:
```json
{
  "employee_id": 1,
  "amount": 5000,
  "reason": "Personal emergency",
  "date": "2025-12-16"
}
```

#### Response (Success - 201):
```json
{
  "success": true,
  "message": "Advance payment created successfully",
  "data": {
    "id": 1,
    "employee_id": 1,
    "amount": 5000,
    "remaining_balance": 5000,
    "reason": "Personal emergency",
    "date": "2025-12-16",
    "status": "PENDING",
    "created_by": 2
  }
}
```

#### cURL Example:
```bash
curl -X POST http://localhost:3000/employee-advances/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee_id": 1,
    "amount": 5000,
    "reason": "Personal emergency",
    "date": "2025-12-16"
  }'
```

---

### 2. Get All Advances for an Employee
**View all advances given to an employee with summary**

```
POST /employee-advances/getByEmployee
```

#### Request Body:
```json
{
  "employee_id": 1
}
```

#### Response (Success - 200):
```json
{
  "success": true,
  "data": {
    "employee_name": "Karan",
    "employee_id": 1,
    "summary": {
      "pending_amount": 5000,
      "total_remaining_balance": 3500,
      "paid_amount": 1500,
      "active_advances": 2
    },
    "advances": [
      {
        "id": 1,
        "employee_id": 1,
        "amount": 5000,
        "remaining_balance": 3500,
        "reason": "Personal emergency",
        "date": "2025-12-16",
        "status": "PARTIAL",
        "repayment_count": 1,
        "total_repaid": 1500
      },
      {
        "id": 2,
        "employee_id": 1,
        "amount": 2000,
        "remaining_balance": 2000,
        "reason": "Medical emergency",
        "date": "2025-12-15",
        "status": "PENDING",
        "repayment_count": 0,
        "total_repaid": 0
      }
    ]
  }
}
```

#### cURL Example:
```bash
curl -X POST http://localhost:3000/employee-advances/getByEmployee \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee_id": 1
  }'
```

---

### 3. Add Repayment for an Advance
**Record a repayment (e.g., Karan paid back ₹1500)**

```
POST /employee-advances/addRepayment
```

#### Request Body:
```json
{
  "advance_id": 1,
  "amount": 1500,
  "date": "2025-12-16",
  "notes": "Partial repayment"
}
```

#### Response (Success - 201):
```json
{
  "success": true,
  "message": "Repayment added successfully",
  "data": {
    "repayment": {
      "id": 5,
      "advance_id": 1,
      "employee_id": 1,
      "amount": 1500,
      "date": "2025-12-16",
      "notes": "Partial repayment",
      "created_by": 2
    },
    "updated_advance": {
      "id": 1,
      "employee_id": 1,
      "amount": 5000,
      "remaining_balance": 3500,
      "reason": "Personal emergency",
      "date": "2025-12-16",
      "status": "PARTIAL",
      "employee_name": "Karan",
      "employee_mobile": "9876543210",
      "repayments": [
        {
          "id": 5,
          "amount": 1500,
          "date": "2025-12-16",
          "notes": "Partial repayment",
          "created_at": "2025-12-16 10:30:00"
        }
      ]
    }
  }
}
```

#### cURL Example:
```bash
curl -X POST http://localhost:3000/employee-advances/addRepayment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "advance_id": 1,
    "amount": 1500,
    "date": "2025-12-16",
    "notes": "Partial repayment"
  }'
```

---

### 4. Get Advance Details with Repayment History
**View complete advance details including all repayments**

```
POST /employee-advances/getDetails
```

#### Request Body:
```json
{
  "advance_id": 1
}
```

#### Response (Success - 200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": 1,
    "amount": 5000,
    "remaining_balance": 3500,
    "reason": "Personal emergency",
    "date": "2025-12-16",
    "status": "PARTIAL",
    "employee_name": "Karan",
    "employee_mobile": "9876543210",
    "repayments": [
      {
        "id": 5,
        "amount": 1500,
        "date": "2025-12-16",
        "notes": "Partial repayment",
        "created_at": "2025-12-16 10:30:00"
      },
      {
        "id": 4,
        "amount": 1000,
        "date": "2025-12-14",
        "notes": "First repayment",
        "created_at": "2025-12-14 09:15:00"
      }
    ]
  }
}
```

#### cURL Example:
```bash
curl -X POST http://localhost:3000/employee-advances/getDetails \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "advance_id": 1
  }'
```

---

### 5. Get Repayment History for an Advance
**View only the repayment history**

```
POST /employee-advances/getRepayments
```

#### Request Body:
```json
{
  "advance_id": 1
}
```

#### Response (Success - 200):
```json
{
  "success": true,
  "data": {
    "advance_id": 1,
    "employee_name": "Karan",
    "original_amount": 5000,
    "remaining_balance": 3500,
    "status": "PARTIAL",
    "advance_date": "2025-12-16",
    "repayment_history": [
      {
        "id": 5,
        "amount": 1500,
        "date": "2025-12-16",
        "notes": "Partial repayment",
        "created_at": "2025-12-16 10:30:00"
      },
      {
        "id": 4,
        "amount": 1000,
        "date": "2025-12-14",
        "notes": "First repayment",
        "created_at": "2025-12-14 09:15:00"
      }
    ]
  }
}
```

#### cURL Example:
```bash
curl -X POST http://localhost:3000/employee-advances/getRepayments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "advance_id": 1
  }'
```

---

### 6. Get Advance Summary for Employee
**Quick summary of all advances - pending, paid, total remaining**

```
POST /employee-advances/summary
```

#### Request Body:
```json
{
  "employee_id": 1
}
```

#### Response (Success - 200):
```json
{
  "success": true,
  "data": {
    "employee_id": 1,
    "employee_name": "Karan",
    "pending_amount": 5000,
    "total_remaining_balance": 3500,
    "paid_amount": 1500,
    "active_advances": 2
  }
}
```

#### cURL Example:
```bash
curl -X POST http://localhost:3000/employee-advances/summary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee_id": 1
  }'
```

---

## Complete Workflow Example

### Scenario: Employee Karan needs ₹5000 advance, pays back ₹1500

#### Step 1: Give advance to Karan
```bash
curl -X POST http://localhost:3000/employee-advances/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee_id": 1,
    "amount": 5000,
    "reason": "Personal emergency",
    "date": "2025-12-16"
  }'
# Response: advance_id = 1, remaining_balance = 5000
```

#### Step 2: Karan makes first repayment (₹1500)
```bash
curl -X POST http://localhost:3000/employee-advances/addRepayment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "advance_id": 1,
    "amount": 1500,
    "date": "2025-12-16",
    "notes": "First repayment"
  }'
# Response: remaining_balance = 3500, status = PARTIAL
```

#### Step 3: Check remaining balance
```bash
curl -X POST http://localhost:3000/employee-advances/getDetails \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "advance_id": 1
  }'
# Response: Shows ₹3500 remaining to be paid
```

#### Step 4: Karan makes another repayment (₹2000)
```bash
curl -X POST http://localhost:3000/employee-advances/addRepayment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "advance_id": 1,
    "amount": 2000,
    "date": "2025-12-17",
    "notes": "Second repayment"
  }'
# Response: remaining_balance = 1500, status = PARTIAL
```

#### Step 5: View complete history
```bash
curl -X POST http://localhost:3000/employee-advances/getRepayments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "advance_id": 1
  }'
# Response: Shows all repayments with dates and amounts
```

#### Step 6: Final repayment (₹1500) - Complete payment
```bash
curl -X POST http://localhost:3000/employee-advances/addRepayment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "advance_id": 1,
    "amount": 1500,
    "date": "2025-12-18",
    "notes": "Final repayment"
  }'
# Response: remaining_balance = 0, status = PAID
```

---

## Data Models

### employee_advances Table
```
- id: Primary key
- employee_id: Link to employees table
- amount: Original advance amount (₹5000)
- remaining_balance: Still pending (₹3500 after ₹1500 repayment)
- reason: Reason for advance
- date: Date when advance was given
- status: PENDING (no repayment), PARTIAL (some repaid), PAID (fully repaid)
- created_by: User ID who created the advance
- created_at: Timestamp
- updated_at: Timestamp (auto-updates when balance changes)
```

### employee_advance_repayments Table
```
- id: Primary key
- advance_id: Link to advance
- employee_id: Link to employee
- amount: Repayment amount (₹1500)
- date: Date of repayment
- notes: Additional notes
- created_by: User ID who recorded repayment
- created_at: Timestamp
```

---

## Validation & Error Handling

### Common Errors:

**1. Repayment exceeds remaining balance:**
```json
{
  "success": false,
  "message": "Repayment amount cannot exceed remaining balance of ₹3500",
  "remaining_balance": 3500
}
```

**2. Trying to repay already paid advance:**
```json
{
  "success": false,
  "message": "This advance has already been fully repaid."
}
```

**3. Missing required fields:**
```json
{
  "success": false,
  "message": "employee_id, amount, and date are required."
}
```

**4. Invalid amount:**
```json
{
  "success": false,
  "message": "Amount must be greater than 0."
}
```

---

## Permission & Authentication

- All endpoints require **authentication** (Bearer token)
- Permission required: `employees`
- User activity is logged for all transactions

---

## Features

✅ **Independent Repayment System** - Not connected to salary calculations
✅ **Flexible Repayments** - Multiple repayments for single advance
✅ **Complete History** - Track all advances and repayments
✅ **Balance Tracking** - Automatic calculation of remaining balance
✅ **Status Management** - Auto-updates status (PENDING → PARTIAL → PAID)
✅ **Audit Trail** - User activity logging for compliance
✅ **Summary View** - Quick overview of employee's advance status

---

## Notes

1. The system does NOT deduct from salary automatically
2. Repayments are independent transactions
3. You can make multiple repayments for a single advance
4. Status automatically updates based on remaining balance
5. All amounts are stored as DECIMAL(15, 2) for precision
