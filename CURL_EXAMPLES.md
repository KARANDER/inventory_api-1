# User Activity History API - CURL Examples

## Base URL
```
http://localhost:3000
```

## Authentication
All endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1. Get All User Activity History

Get all activity history (default limit: 100)

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{}'
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "user_name": "John Doe",
      "model_name": "accounts",
      "action_type": "UPDATE",
      "record_id": 10,
      "description": "Updated account",
      "changes": {
        "account_name": {
          "old": "Bank A",
          "new": "Bank B"
        },
        "balance": {
          "old": 1000.00,
          "new": 1500.00
        }
      },
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 2. Filter by User ID

Get activity history for a specific user

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": 5
  }'
```

---

## 3. Filter by Model/Page Name

Get activity history for a specific model (e.g., accounts, sales_orders, etc.)

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "model_name": "accounts"
  }'
```

**Available model names:**
- `accounts`
- `contacts`
- `inventory_items`
- `master_items`
- `sales_orders`
- `sales_invoices`
- `purchase_invoices`
- `invoices`
- `finishes`
- `order_stock`
- `transport`
- `carton_inventory`
- `pati`
- `users`

---

## 4. Filter by Action Type

Get activity history for a specific action type

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "action_type": "UPDATE"
  }'
```

**Available action types:**
- `CREATE`
- `UPDATE`
- `DELETE`
- `LOGIN`
- `LOGOUT`

---

## 5. Filter by Date Range

Get activity history between two dates

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }'
```

**Date format:** `YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS`

---

## 6. Pagination

Get activity history with pagination (limit and offset)

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "limit": 50,
    "offset": 0
  }'
```

---

## 7. Combined Filters

Get activity history with multiple filters

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": 5,
    "model_name": "accounts",
    "action_type": "UPDATE",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "limit": 20,
    "offset": 0
  }'
```

---

## 8. Get Only CREATE Actions

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "action_type": "CREATE"
  }'
```

---

## 9. Get Only DELETE Actions

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "action_type": "DELETE"
  }'
```

---

## 10. Get UPDATE Actions with Changes

Get all UPDATE actions to see what fields were changed

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "action_type": "UPDATE",
    "limit": 100
  }'
```

**Response with changes:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "user_name": "John Doe",
      "model_name": "accounts",
      "action_type": "UPDATE",
      "record_id": 10,
      "description": "Updated account",
      "changes": {
        "account_name": {
          "old": "Bank A",
          "new": "Bank B"
        },
        "balance": {
          "old": 1000.00,
          "new": 1500.00
        }
      },
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 11. Get Activity for Specific Model and User

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": 5,
    "model_name": "sales_orders"
  }'
```

---

## 12. Get Recent Activity (Last 10 Records)

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "limit": 10,
    "offset": 0
  }'
```

---

## 13. Get Activity for Today

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "start_date": "2024-01-15 00:00:00",
    "end_date": "2024-01-15 23:59:59"
  }'
```

---

## 14. Get Login Activity

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "action_type": "LOGIN"
  }'
```

---

## 15. Get All Activity for Sales Invoices Model

```bash
curl -X POST http://localhost:3000/user-activity/getHistory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "model_name": "sales_invoices"
  }'
```

---

## Notes:

1. **Authentication Required:** All endpoints require a valid JWT token
2. **Permission Required:** User must have `accounts` permission to access activity history
3. **Default Limit:** If not specified, default limit is 100 records
4. **Default Offset:** If not specified, default offset is 0
5. **Changes Field:** Only UPDATE actions will have the `changes` field populated
6. **Date Format:** Use `YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS` format for dates
7. **Ordering:** Results are ordered by `created_at DESC` (newest first)

---

## Example: Get JWT Token First

Before using the activity API, you need to login:

```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your_password"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Then use this token in the Authorization header for all activity API calls.

