# Journal Entries API - cURL Examples

Replace `YOUR_JWT_TOKEN` with your actual JWT token.

## Payment Methods

### 1. Get All Payment Methods
```bash
curl -X POST http://localhost:3000/payment-methods/getAll \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 2. Create Payment Method
```bash
curl -X POST http://localhost:3000/payment-methods/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "UPI"
  }'
```

### 3. Update Payment Method
```bash
curl -X POST http://localhost:3000/payment-methods/update \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 7,
    "name": "UPI Payment"
  }'
```

### 4. Delete Payment Method
```bash
curl -X POST http://localhost:3000/payment-methods/delete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 7
  }'
```

---

## Journal Entries

### 1. Create Receipt Entry
```bash
curl -X POST http://localhost:3000/journal-entries/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-15",
    "type": "Receipt",
    "customer_name": "Customer A",
    "method_id": 1,
    "amount": 10000.00,
    "notes": "Invoice Payment"
  }'
```

### 2. Create Payment Entry
```bash
curl -X POST http://localhost:3000/journal-entries/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-15",
    "type": "Payment",
    "customer_name": "Customer B",
    "method_id": 2,
    "amount": 5000.00,
    "notes": "Monthly Payment"
  }'
```

### 3. Get All Journal Entries
```bash
curl -X POST http://localhost:3000/journal-entries/getAll \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 4. Get All Journal Entries with Filters
```bash
curl -X POST http://localhost:3000/journal-entries/getAll \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "search": "Customer A",
    "type": "Receipt",
    "startDate": "2025-01-01",
    "endDate": "2025-01-31",
    "limit": 50
  }'
```

### 5. Get Journal Entry by ID
```bash
curl -X POST http://localhost:3000/journal-entries/getById \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1
  }'
```

### 6. Update Journal Entry
```bash
curl -X POST http://localhost:3000/journal-entries/update \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "amount": 12000.00,
    "notes": "Updated payment amount"
  }'
```

### 7. Delete Journal Entry
```bash
curl -X POST http://localhost:3000/journal-entries/delete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1
  }'
```

### 8. Get Metrics (All Time)
```bash
curl -X POST http://localhost:3000/journal-entries/getMetrics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 9. Get Metrics (Date Range)
```bash
curl -X POST http://localhost:3000/journal-entries/getMetrics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-01-01",
    "endDate": "2025-01-31"
  }'
```

---

## Complete Flow Example

### Step 1: Get Payment Methods (for dropdown)
```bash
curl -X POST http://localhost:3000/payment-methods/getAll \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Step 2: Create a Receipt Entry
```bash
curl -X POST http://localhost:3000/journal-entries/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-15",
    "type": "Receipt",
    "customer_name": "Customer A",
    "method_id": 1,
    "amount": 10000.00,
    "notes": "Invoice Payment"
  }'
```

### Step 3: Create a Payment Entry
```bash
curl -X POST http://localhost:3000/journal-entries/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-01-15",
    "type": "Payment",
    "customer_name": "Customer B",
    "method_id": 1,
    "amount": 7500.00,
    "notes": "Monthly Payment"
  }'
```

### Step 4: Get Metrics
```bash
curl -X POST http://localhost:3000/journal-entries/getMetrics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
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

### Step 5: Get All Entries
```bash
curl -X POST http://localhost:3000/journal-entries/getAll \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

