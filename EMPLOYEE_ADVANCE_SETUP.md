# Employee Advance Payment System - Setup & Usage Guide

## What Was Created?

A complete **independent employee advance payment system** with:

### 📊 Database Tables
1. **employee_advances** - Track advances given to employees
2. **employee_advance_repayments** - Track individual repayments
3. **employee_advance_summary view** - Quick overview of advances

### 🔧 Backend Components
1. **Model** - `model/employee_model.js` (new methods added)
2. **Controller** - `controller/employee_advance_controller.js` (new file)
3. **Routes** - `route/employee_advance_route.js` (new file)
4. **Main App** - `index.js` (routes integrated)

---

## Setup Steps

### Step 1: Run Database SQL
Copy and paste the entire contents of this file into your database:
```
📄 database/employee_advance_table.sql
```

### Step 2: Restart Server
The server will automatically use the new routes.

### Step 3: Test API
Use the curl examples provided in:
```
📄 EMPLOYEE_ADVANCE_API_DOCUMENTATION.md
```

---

## How It Works

### Scenario: Employee Karan needs advance
```
Admin gives Karan ₹5000 (Advance created, remaining balance = ₹5000)
       ↓
Karan pays ₹1500 on 16-Dec (Repayment 1, remaining = ₹3500)
       ↓
Karan pays ₹2000 on 17-Dec (Repayment 2, remaining = ₹1500)
       ↓
Karan pays ₹1500 on 18-Dec (Repayment 3, remaining = ₹0, status = PAID)
```

Each step is tracked independently in the database.

---

## Key Features

### ✅ Independent Repayment
- NOT connected to salary deductions
- Manual repayments only
- Can repay anytime, in any amount (up to remaining balance)

### ✅ Complete History
- All advances stored with date, reason, amount
- Each repayment recorded with date and notes
- Automatic status tracking (PENDING → PARTIAL → PAID)

### ✅ Balance Tracking
- Original amount shown
- Remaining balance calculated automatically
- Shows how much was already repaid

### ✅ Summary Available
- Quick view: Total pending, total remaining, total paid
- Shows active (unpaid) advances count
- Works for multiple advances per employee

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/employee-advances/create` | Give advance to employee |
| POST | `/employee-advances/getByEmployee` | View all advances for employee |
| POST | `/employee-advances/getDetails` | View advance with repayment history |
| POST | `/employee-advances/addRepayment` | Record repayment |
| POST | `/employee-advances/getRepayments` | View only repayment history |
| POST | `/employee-advances/summary` | Quick summary for employee |

---

## Example: Give Karan ₹5000 Advance

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

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employee_id": 1,
    "amount": 5000,
    "remaining_balance": 5000,
    "status": "PENDING"
  }
}
```

---

## Example: Record Repayment of ₹1500

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
```

Response:
```json
{
  "success": true,
  "data": {
    "updated_advance": {
      "remaining_balance": 3500,
      "status": "PARTIAL"
    }
  }
}
```

---

## Files Created/Modified

### New Files:
```
✅ database/employee_advance_table.sql
✅ controller/employee_advance_controller.js
✅ route/employee_advance_route.js
✅ EMPLOYEE_ADVANCE_API_DOCUMENTATION.md (detailed docs)
```

### Modified Files:
```
✅ model/employee_model.js (added 7 new methods)
✅ index.js (added route integration)
```

---

## Validation Rules

- ❌ Amount must be > 0
- ❌ Cannot repay more than remaining balance
- ❌ Cannot repay an already paid advance
- ❌ Employee must exist
- ❌ All dates must be valid

---

## Database Queries Available

The system includes optimized queries with:
- Foreign key relationships
- Indexes for fast lookups
- Transaction support for data consistency
- Views for reporting

---

## Activity Logging

All actions are logged:
- Advance creation
- Repayment additions
- User info (who created, when)
- Complete audit trail

---

## Support & Testing

For detailed API documentation with all response examples, see:
```
📄 EMPLOYEE_ADVANCE_API_DOCUMENTATION.md
```

---

## Next Steps

1. ✅ Run the SQL file in your database
2. ✅ Test with the curl examples
3. ✅ Integrate into your frontend
4. ✅ Monitor through user activity logs

All set! Your employee advance payment system is ready. 🚀
