# Journal Entry Types & User Management API Documentation

**Base URL:** `http://localhost:3000`  
**Date:** April 18, 2026  
**Version:** 1.0

---

## 📌 Table of Contents

1. [Authentication](#authentication)
2. [User Management APIs](#user-management-apis)
3. [Journal Entry Type APIs](#journal-entry-type-apis)
4. [Journal Entry APIs](#journal-entry-apis)
5. [Complete Workflow Example](#complete-workflow-example)
6. [Error Handling](#error-handling)

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header.

### Login

**Endpoint:** `POST /user/login`  
**Authentication:** Not required

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Logged in successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**How to use token:**

```javascript
// Add to all API requests
headers: {
  'Authorization': 'Bearer YOUR_TOKEN_HERE',
  'Content-Type': 'application/json'
}
```

---

## 👥 User Management APIs

### 1. Get All Users

**Endpoint:** `POST /user/getAll`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Purpose:** Get list of all users for dropdown/selection when creating journal entry types

**Request:**

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
      "user_name": "John Doe",
      "email": "john@example.com",
      "permissions": ["receipts", "payments", "journal_entries"],
      "created_at": "2026-01-15T10:30:00.000Z",
      "updated_at": "2026-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "user_name": "Jane Smith",
      "email": "jane@example.com",
      "permissions": ["journal_entries"],
      "created_at": "2026-02-20T14:20:00.000Z",
      "updated_at": "2026-02-20T14:20:00.000Z"
    }
  ]
}
```

**Frontend Usage:**

```javascript
// Fetch users for dropdown
const response = await fetch("http://localhost:3000/user/getAll", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({}),
});

const { data: users } = await response.json();
// Use users array to populate dropdown
```

---

### 2. Get User By ID

**Endpoint:** `POST /user/getById`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Request:**

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
    "user_name": "John Doe",
    "email": "john@example.com",
    "permissions": ["receipts", "payments", "journal_entries"],
    "created_at": "2026-01-15T10:30:00.000Z",
    "updated_at": "2026-01-15T10:30:00.000Z"
  }
}
```

---

### 3. Create User

**Endpoint:** `POST /user/register`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Request:**

```json
{
  "user_name": "New User",
  "email": "newuser@example.com",
  "password": "securePassword123",
  "permissions": ["receipts", "payments", "journal_entries"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "id": 3,
    "user_name": "New User",
    "email": "newuser@example.com",
    "permissions": ["receipts", "payments", "journal_entries"]
  }
}
```

**Available Permissions:**

- `receipts`
- `payments`
- `journal_entries`
- `inventory`
- `sales`
- (add more as needed)

---

### 4. Update User

**Endpoint:** `POST /user/update`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Request:**

```json
{
  "id": 3,
  "user_name": "Updated Name",
  "email": "updated@example.com",
  "password": "newPassword123",
  "permissions": ["journal_entries"]
}
```

**Note:** All fields except `id` are optional. Only send fields you want to update.

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "id": 3,
    "user_name": "Updated Name",
    "email": "updated@example.com",
    "permissions": ["journal_entries"]
  }
}
```

---

### 5. Delete User

**Endpoint:** `POST /user/delete`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Request:**

```json
{
  "id": 3
}
```

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully."
}
```

---

## 📁 Journal Entry Type APIs

### 1. Get My Accessible Types

**Endpoint:** `POST /journal-entry-types/getMyTypes`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Purpose:** Get all journal entry types the current user has access to (for dropdown/navigation)

**Request:**

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
      "name": "Customer Payments",
      "description": "Track all customer payment transactions",
      "created_by": 1,
      "created_by_name": "John Doe",
      "entry_count": 45,
      "created_at": "2026-03-01T09:00:00.000Z",
      "updated_at": "2026-03-01T09:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Office Expenses",
      "description": "Track office-related expenses",
      "created_by": 1,
      "created_by_name": "John Doe",
      "entry_count": 23,
      "created_at": "2026-03-05T11:30:00.000Z",
      "updated_at": "2026-03-05T11:30:00.000Z"
    }
  ]
}
```

**Frontend Usage:**

```javascript
// Show as tabs or dropdown for user to select which journal type to view
const types = [
  { id: 1, name: "Customer Payments", entry_count: 45 },
  { id: 2, name: "Office Expenses", entry_count: 23 },
];
```

---

### 2. Get All Types (Admin)

**Endpoint:** `POST /journal-entry-types/getAll`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Purpose:** Get all journal entry types (admin view, shows all types regardless of access)

**Request:**

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
      "name": "Customer Payments",
      "description": "Track all customer payment transactions",
      "created_by": 1,
      "created_by_name": "John Doe",
      "entry_count": 45,
      "created_at": "2026-03-01T09:00:00.000Z",
      "updated_at": "2026-03-01T09:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Type By ID

**Endpoint:** `POST /journal-entry-types/getById`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Request:**

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
    "name": "Customer Payments",
    "description": "Track all customer payment transactions",
    "created_by": 1,
    "created_by_name": "John Doe",
    "created_at": "2026-03-01T09:00:00.000Z",
    "updated_at": "2026-03-01T09:00:00.000Z",
    "users": [
      {
        "id": 1,
        "user_name": "John Doe",
        "email": "john@example.com"
      },
      {
        "id": 2,
        "user_name": "Jane Smith",
        "email": "jane@example.com"
      }
    ]
  }
}
```

---

### 4. Create Journal Entry Type

**Endpoint:** `POST /journal-entry-types/`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Purpose:** Create a new custom journal entry type with user access control

**Request:**

```json
{
  "name": "Supplier Payments",
  "description": "Track all supplier payment transactions",
  "user_ids": [1, 2, 3]
}
```

**Validation:**

- `name`: Required, must be unique
- `description`: Optional
- `user_ids`: Required, array of user IDs who can access this type (minimum 1 user)

**Response:**

```json
{
  "success": true,
  "message": "Journal entry type created successfully",
  "data": {
    "id": 3,
    "name": "Supplier Payments",
    "description": "Track all supplier payment transactions",
    "created_by": 1,
    "created_by_name": "John Doe",
    "created_at": "2026-04-18T10:00:00.000Z",
    "updated_at": "2026-04-18T10:00:00.000Z"
  }
}
```

**Frontend Form Example:**

```javascript
const formData = {
  name: "Supplier Payments",
  description: "Track all supplier payment transactions",
  user_ids: [1, 2, 3], // Selected from user dropdown
};
```

---

### 5. Update Journal Entry Type

**Endpoint:** `POST /journal-entry-types/update`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Request:**

```json
{
  "id": 3,
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Note:** Only send fields you want to update. Cannot update `user_ids` here (use addUsers/removeUsers instead).

**Response:**

```json
{
  "success": true,
  "message": "Journal entry type updated successfully",
  "data": {
    "id": 3,
    "name": "Updated Name",
    "description": "Updated description",
    "created_by": 1,
    "created_by_name": "John Doe"
  }
}
```

---

### 6. Add Users to Type

**Endpoint:** `POST /journal-entry-types/addUsers`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Purpose:** Grant additional users access to a journal entry type

**Request:**

```json
{
  "id": 3,
  "user_ids": [4, 5]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Users added successfully"
}
```

---

### 7. Remove Users from Type

**Endpoint:** `POST /journal-entry-types/removeUsers`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Purpose:** Revoke user access from a journal entry type

**Request:**

```json
{
  "id": 3,
  "user_ids": [4, 5]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Users removed successfully"
}
```

---

### 8. Delete Journal Entry Type

**Endpoint:** `POST /journal-entry-types/delete`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Request:**

```json
{
  "id": 3
}
```

**Response:**

```json
{
  "success": true,
  "message": "Journal entry type deleted successfully"
}
```

**Error if entries exist:**

```json
{
  "success": false,
  "message": "Cannot delete journal entry type that has existing entries"
}
```

---

## 📝 Journal Entry APIs

**IMPORTANT:** All journal entry APIs now require `entry_type_id` parameter!

### 1. Create Journal Entry

**Endpoint:** `POST /journal-entries/`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Request:**

```json
{
  "entry_type_id": 1,
  "date": "2026-04-18",
  "type": "Receipt",
  "customer_name": "ABC Company",
  "method_id": 1,
  "amount": 5000,
  "notes": "Payment for invoice #123"
}
```

**Validation:**

- `entry_type_id`: Required (user must have access to this type)
- `date`: Required (format: YYYY-MM-DD)
- `type`: Required (must be "Receipt" or "Payment")
- `customer_name`: Required
- `method_id`: Required (payment method ID)
- `amount`: Required (must be > 0)
- `notes`: Optional

**Response:**

```json
{
  "success": true,
  "message": "Journal entry created successfully",
  "data": {
    "id": 101,
    "entry_type_id": 1,
    "entry_type_name": "Customer Payments",
    "date": "2026-04-18",
    "type": "Receipt",
    "customer_name": "ABC Company",
    "method_id": 1,
    "method_name": "Cash",
    "amount": 5000,
    "notes": "Payment for invoice #123",
    "user_id": 1,
    "created_at": "2026-04-18T10:30:00.000Z",
    "updated_at": "2026-04-18T10:30:00.000Z"
  }
}
```

---

### 2. Get All Journal Entries

**Endpoint:** `POST /journal-entries/getAll`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Purpose:** Get all entries for a specific journal entry type (with filters)

**Request:**

```json
{
  "entry_type_id": 1,
  "search": "ABC",
  "type": "Receipt",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "limit": 100
}
```

**Parameters:**

- `entry_type_id`: **Required** (which journal type to view)
- `search`: Optional (searches in customer_name and method_name)
- `type`: Optional ("Receipt" or "Payment")
- `startDate`: Optional (format: YYYY-MM-DD)
- `endDate`: Optional (format: YYYY-MM-DD)
- `limit`: Optional (default: no limit)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "entry_type_id": 1,
      "entry_type_name": "Customer Payments",
      "date": "2026-04-18",
      "type": "Receipt",
      "customer_name": "ABC Company",
      "method_id": 1,
      "method_name": "Cash",
      "amount": 5000,
      "notes": "Payment for invoice #123",
      "user_id": 1,
      "created_at": "2026-04-18T10:30:00.000Z",
      "updated_at": "2026-04-18T10:30:00.000Z"
    },
    {
      "id": 102,
      "entry_type_id": 1,
      "entry_type_name": "Customer Payments",
      "date": "2026-04-17",
      "type": "Payment",
      "customer_name": "XYZ Supplier",
      "method_id": 2,
      "method_name": "Bank Transfer",
      "amount": 3000,
      "notes": null,
      "user_id": 1,
      "created_at": "2026-04-17T14:20:00.000Z",
      "updated_at": "2026-04-17T14:20:00.000Z"
    }
  ]
}
```

**Frontend Usage:**

```javascript
// When user selects a journal type, fetch its entries
const selectedTypeId = 1; // From dropdown/tabs

const response = await fetch("http://localhost:3000/journal-entries/getAll", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    entry_type_id: selectedTypeId,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  }),
});

const { data: entries } = await response.json();
// Display entries in table
```

---

### 3. Get Journal Entry By ID

**Endpoint:** `POST /journal-entries/getById`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Request:**

```json
{
  "id": 101
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 101,
    "entry_type_id": 1,
    "entry_type_name": "Customer Payments",
    "date": "2026-04-18",
    "type": "Receipt",
    "customer_name": "ABC Company",
    "method_id": 1,
    "method_name": "Cash",
    "amount": 5000,
    "notes": "Payment for invoice #123",
    "user_id": 1,
    "created_at": "2026-04-18T10:30:00.000Z",
    "updated_at": "2026-04-18T10:30:00.000Z"
  }
}
```

---

### 4. Update Journal Entry

**Endpoint:** `POST /journal-entries/update`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Request:**

```json
{
  "id": 101,
  "entry_type_id": 2,
  "date": "2026-04-19",
  "type": "Payment",
  "customer_name": "Updated Company",
  "method_id": 2,
  "amount": 6000,
  "notes": "Updated notes"
}
```

**Note:** All fields except `id` are optional. Only send fields you want to update.

**Response:**

```json
{
  "success": true,
  "message": "Journal entry updated successfully",
  "data": {
    "id": 101,
    "entry_type_id": 2,
    "entry_type_name": "Office Expenses",
    "date": "2026-04-19",
    "type": "Payment",
    "customer_name": "Updated Company",
    "method_id": 2,
    "method_name": "Bank Transfer",
    "amount": 6000,
    "notes": "Updated notes"
  }
}
```

---

### 5. Delete Journal Entry

**Endpoint:** `POST /journal-entries/delete`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Request:**

```json
{
  "id": 101
}
```

**Response:**

```json
{
  "success": true,
  "message": "Journal entry deleted successfully"
}
```

---

### 6. Get Metrics

**Endpoint:** `POST /journal-entries/getMetrics`  
**Authentication:** Required  
**Permission:** `journal_entries`

**Purpose:** Get total receipts, payments, and remaining balance for a journal entry type

**Request:**

```json
{
  "entry_type_id": 1,
  "startDate": "2026-01-01",
  "endDate": "2026-12-31"
}
```

**Parameters:**

- `entry_type_id`: **Required**
- `startDate`: Optional (format: YYYY-MM-DD)
- `endDate`: Optional (format: YYYY-MM-DD)

**Response:**

```json
{
  "success": true,
  "data": {
    "total_receipts": 50000,
    "total_payments": 30000,
    "remaining_balance": 20000
  }
}
```

**Frontend Usage:**

```javascript
// Display metrics at the top of journal entries page
const metrics = {
  total_receipts: 50000, // Green card
  total_payments: 30000, // Red card
  remaining_balance: 20000, // Blue card
};
```

---

## 🔄 Complete Workflow Example

### Scenario: User wants to create and manage "Customer Payments" journal

```javascript
// 1. Login
const loginResponse = await fetch("http://localhost:3000/user/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@example.com",
    password: "password123",
  }),
});
const { token } = await loginResponse.json();

// 2. Get all users (for creating journal type)
const usersResponse = await fetch("http://localhost:3000/user/getAll", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({}),
});
const { data: users } = await usersResponse.json();
// Display users in multi-select dropdown

// 3. Create journal entry type
const createTypeResponse = await fetch(
  "http://localhost:3000/journal-entry-types/",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Customer Payments",
      description: "Track all customer payment transactions",
      user_ids: [1, 2, 3], // Selected users from dropdown
    }),
  },
);
const { data: newType } = await createTypeResponse.json();

// 4. Get my accessible types (for navigation/tabs)
const typesResponse = await fetch(
  "http://localhost:3000/journal-entry-types/getMyTypes",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  },
);
const { data: myTypes } = await typesResponse.json();
// Display as tabs: ["Customer Payments", "Office Expenses", ...]

// 5. Create a journal entry
const createEntryResponse = await fetch(
  "http://localhost:3000/journal-entries/",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entry_type_id: newType.id,
      date: "2026-04-18",
      type: "Receipt",
      customer_name: "ABC Company",
      method_id: 1,
      amount: 5000,
      notes: "Payment for invoice #123",
    }),
  },
);

// 6. Get all entries for this type
const entriesResponse = await fetch(
  "http://localhost:3000/journal-entries/getAll",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entry_type_id: newType.id,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
    }),
  },
);
const { data: entries } = await entriesResponse.json();
// Display in table

// 7. Get metrics
const metricsResponse = await fetch(
  "http://localhost:3000/journal-entries/getMetrics",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entry_type_id: newType.id,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
    }),
  },
);
const { data: metrics } = await metricsResponse.json();
// Display: Total Receipts: ₹50,000 | Total Payments: ₹30,000 | Balance: ₹20,000
```

---

## ❌ Error Handling

### Common Error Responses

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Journal entry type ID is required"
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Invalid credentials."
}
```

**403 Forbidden:**

```json
{
  "success": false,
  "message": "You do not have access to this journal entry type"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Journal entry not found"
}
```

**409 Conflict:**

```json
{
  "success": false,
  "message": "A journal entry type with this name already exists"
}
```

**500 Server Error:**

```json
{
  "success": false,
  "message": "Server Error",
  "error": "Detailed error message"
}
```

### Frontend Error Handling Example

```javascript
try {
  const response = await fetch("http://localhost:3000/journal-entries/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!result.success) {
    // Show error message to user
    alert(result.message);
    return;
  }

  // Success - update UI
  console.log("Entry created:", result.data);
} catch (error) {
  console.error("Network error:", error);
  alert("Failed to connect to server");
}
```

---

## 📋 UI Recommendations

### 1. Journal Entry Types Page

- **List View:** Show all accessible types with entry count
- **Create Button:** Opens modal with form (name, description, user multi-select)
- **Actions:** Edit, Delete, Manage Users

### 2. Journal Entries Page

- **Tabs/Dropdown:** Show accessible journal types
- **Metrics Cards:** Display total receipts, payments, balance
- **Filters:** Date range, type (Receipt/Payment), search
- **Table:** Show all entries with edit/delete actions
- **Create Button:** Opens form with all required fields

### 3. User Management Page

- **Table:** List all users with permissions
- **Create Button:** Opens form (name, email, password, permissions)
- **Actions:** Edit, Delete

---

## 🔑 Key Points for Frontend

1. **Always include `entry_type_id`** when working with journal entries
2. **Check user permissions** before showing UI elements
3. **Each journal type is independent** - entries don't mix between types
4. **Use `getMyTypes`** to show only accessible types to the user
5. **Token expires** - handle 401 errors by redirecting to login
6. **All POST requests** - even for fetching data (not RESTful, but consistent)

---

## 📞 Support

For questions or issues, contact the backend team.

**Last Updated:** April 18, 2026
