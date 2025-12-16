# Employee Advance Payment - cURL Quick Reference

## Prerequisites
- Replace `YOUR_TOKEN` with your actual authentication token
- Replace `localhost:3000` with your server address
- Base URL: `http://localhost:3000`

---

## 1️⃣ CREATE ADVANCE - Give Karan ₹5000

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

**Response:** advance_id = 1, remaining_balance = 5000

---

## 2️⃣ GET ALL ADVANCES - View all Karan's advances

```bash
curl -X POST http://localhost:3000/employee-advances/getByEmployee \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee_id": 1
  }'
```

**Shows:** All advances, summary (pending, remaining, paid amounts)

---

## 3️⃣ RECORD REPAYMENT - Karan pays back ₹1500

```bash
curl -X POST http://localhost:3000/employee-advances/addRepayment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "advance_id": 1,
    "amount": 1500,
    "date": "2025-12-16",
    "notes": "First payment"
  }'
```

**Response:** remaining_balance = 3500, status = PARTIAL

---

## 4️⃣ GET ADVANCE DETAILS - View advance + repayment history

```bash
curl -X POST http://localhost:3000/employee-advances/getDetails \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "advance_id": 1
  }'
```

**Shows:** Complete advance info + all repayments made

---

## 5️⃣ GET REPAYMENT HISTORY - View only repayments

```bash
curl -X POST http://localhost:3000/employee-advances/getRepayments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "advance_id": 1
  }'
```

**Shows:** All repayments with dates and amounts

---

## 6️⃣ GET SUMMARY - Quick overview

```bash
curl -X POST http://localhost:3000/employee-advances/summary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employee_id": 1
  }'
```

**Shows:** pending_amount, total_remaining_balance, paid_amount, active_advances

---

## 📋 Complete Workflow

### Give advance
```bash
# Step 1: Create advance
curl -X POST http://localhost:3000/employee-advances/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"employee_id": 1, "amount": 5000, "reason": "Emergency", "date": "2025-12-16"}'
```

### Track repayments
```bash
# Step 2: First repayment
curl -X POST http://localhost:3000/employee-advances/addRepayment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"advance_id": 1, "amount": 1500, "date": "2025-12-16", "notes": "Payment 1"}'

# Step 3: Check remaining
curl -X POST http://localhost:3000/employee-advances/getDetails \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"advance_id": 1}'

# Step 4: Second repayment
curl -X POST http://localhost:3000/employee-advances/addRepayment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"advance_id": 1, "amount": 2000, "date": "2025-12-17", "notes": "Payment 2"}'

# Step 5: Final repayment
curl -X POST http://localhost:3000/employee-advances/addRepayment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"advance_id": 1, "amount": 1500, "date": "2025-12-18", "notes": "Final payment"}'

# Step 6: View complete history
curl -X POST http://localhost:3000/employee-advances/getRepayments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"advance_id": 1}'
```

---

## Response Examples

### Create Advance (201)
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
    "status": "PENDING"
  }
}
```

### Add Repayment (201)
```json
{
  "success": true,
  "message": "Repayment added successfully",
  "data": {
    "repayment": {
      "id": 5,
      "advance_id": 1,
      "amount": 1500,
      "date": "2025-12-16"
    },
    "updated_advance": {
      "id": 1,
      "remaining_balance": 3500,
      "status": "PARTIAL",
      "amount": 5000
    }
  }
}
```

### Get Details (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_name": "Karan",
    "amount": 5000,
    "remaining_balance": 3500,
    "status": "PARTIAL",
    "reason": "Personal emergency",
    "repayments": [
      {
        "id": 5,
        "amount": 1500,
        "date": "2025-12-16",
        "notes": "First payment"
      }
    ]
  }
}
```

### Get Summary (200)
```json
{
  "success": true,
  "data": {
    "employee_id": 1,
    "employee_name": "Karan",
    "pending_amount": 5000,
    "total_remaining_balance": 3500,
    "paid_amount": 1500,
    "active_advances": 1
  }
}
```

---

## Error Examples

### Repayment exceeds balance (400)
```json
{
  "success": false,
  "message": "Repayment amount cannot exceed remaining balance of ₹3500",
  "remaining_balance": 3500
}
```

### Already fully paid (400)
```json
{
  "success": false,
  "message": "This advance has already been fully repaid."
}
```

### Invalid amount (400)
```json
{
  "success": false,
  "message": "Amount must be greater than 0."
}
```

### Employee not found (404)
```json
{
  "success": false,
  "message": "Employee not found."
}
```

---

## Key Points

✅ All endpoints are **POST** requests
✅ Required header: `Authorization: Bearer TOKEN`
✅ Repayments are **NOT connected to salary**
✅ Can make **multiple repayments** for one advance
✅ Balance automatically **tracked and updated**
✅ Status auto-changes: PENDING → PARTIAL → PAID
✅ Complete **history available** for auditing

---

For full documentation, see: `EMPLOYEE_ADVANCE_API_DOCUMENTATION.md`
