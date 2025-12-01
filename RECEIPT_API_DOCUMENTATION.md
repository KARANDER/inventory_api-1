# Receipt API Documentation

## 📋 Overview

Receipt API allows you to create, read, update, and delete receipt records. When a receipt is created, it automatically:
- ✅ Adds amount to account balance
- ✅ Creates account history record (CREDIT)
- ✅ Updates customer details (if customer type)
- ✅ Handles invoice payment cascading

**Base URL**: `http://localhost:3000/receipts`

**Authentication**: Required (JWT token in `Authorization: Bearer <token>` header)
**Permission**: `receipts` permission required

---

## 📡 API Endpoints

### 1. Create Receipt

**Endpoint**: `POST /receipts`

**Content-Type**: `multipart/form-data` (for file upload) or `application/json`

**Request Body** (Form Data):
```
date: "2024-01-15"              // Required: Receipt date (YYYY-MM-DD)
amount: 5000.00                  // Required: Receipt amount
contact_id: 3                    // Required: Contact ID (customer/supplier)
account_id: 1                    // Required: Account ID where money is added
description: "Payment received"  // Optional: Description
reference: "REF001"              // Optional: Reference number
note: "Additional notes"         // Optional: Notes
customer_id: 5                   // Optional: Customer ID (for invoice cascading)
image: [File]                    // Optional: Receipt image file (jpeg, jpg, png, gif, max 10MB)
```

**Request Example** (using FormData):
```javascript
const formData = new FormData();
formData.append('date', '2024-01-15');
formData.append('amount', '5000.00');
formData.append('contact_id', '3');
formData.append('account_id', '1');
formData.append('description', 'Payment received from customer');
formData.append('reference', 'REF001');
formData.append('note', 'Monthly payment');
formData.append('customer_id', '5');
formData.append('image', fileInput.files[0]); // File input

fetch('http://localhost:3000/receipts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <your_token>'
  },
  body: formData
});
```

**Request Example** (JSON - without image):
```json
{
  "date": "2024-01-15",
  "amount": 5000.00,
  "contact_id": 3,
  "account_id": 1,
  "description": "Payment received from customer",
  "reference": "REF001",
  "note": "Monthly payment",
  "customer_id": 5
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "Receipt created and account balance updated.",
  "data": {
    "id": 10,
    "date": "2024-01-15",
    "amount": "5000.00",
    "contact_id": 3,
    "account_id": 1,
    "description": "Payment received from customer",
    "reference": "REF001",
    "note": "Monthly payment",
    "image_url": "uploads/image-1234567890.jpg",
    "user_id": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response** (Error - 500):
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Error message details"
}
```

**What Happens Automatically**:
- ✅ Account balance is increased by the amount
- ✅ Account history record is created (CREDIT transaction)
- ✅ Customer details are updated (if contact is Customer type)
- ✅ Invoice payment cascading (if customer_id provided)

---

### 2. Get All Receipts

**Endpoint**: `POST /receipts/getAllReceipt`

**Request Body**:
```json
{}
```
(No body required, but POST method is used)

**Response** (Success - 200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2024-01-15",
      "amount": "5000.00",
      "contact_id": 3,
      "account_id": 1,
      "description": "Payment received from customer",
      "reference": "REF001",
      "note": "Monthly payment",
      "image_url": "uploads/image-1234567890.jpg",
      "user_id": 1,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "date": "2024-01-16",
      "amount": "3000.00",
      "contact_id": 4,
      "account_id": 1,
      "description": "Another payment",
      "reference": "REF002",
      "note": null,
      "image_url": null,
      "user_id": 1,
      "created_at": "2024-01-16T11:00:00.000Z",
      "updated_at": "2024-01-16T11:00:00.000Z"
    }
  ]
}
```

**Response** (Error - 500):
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Error message details"
}
```

---

### 3. Update Receipt

**Endpoint**: `POST /receipts/updateReceipt`

**Content-Type**: `multipart/form-data` (if updating image) or `application/json`

**Request Body** (Form Data):
```
id: 10                           // Required: Receipt ID to update
date: "2024-01-20"              // Optional: New date
amount: 6000.00                  // Optional: New amount
contact_id: 3                    // Optional: New contact ID
account_id: 1                    // Optional: New account ID
description: "Updated description" // Optional: New description
reference: "REF001-UPDATED"      // Optional: New reference
note: "Updated notes"            // Optional: New notes
customer_id: 5                   // Optional: New customer ID
image: [File]                    // Optional: New receipt image (replaces old one)
```

**Request Example** (JSON):
```json
{
  "id": 10,
  "date": "2024-01-20",
  "amount": 6000.00,
  "description": "Updated payment description",
  "reference": "REF001-UPDATED"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Receipt updated successfully.",
  "data": {
    "id": 10,
    "date": "2024-01-20",
    "amount": "6000.00",
    "contact_id": 3,
    "account_id": 1,
    "description": "Updated payment description",
    "reference": "REF001-UPDATED",
    "note": "Updated notes",
    "image_url": "uploads/image-1234567891.jpg",
    "user_id": 1,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-20T12:00:00.000Z"
  }
}
```

**Response** (Error - 500):
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Error message details"
}
```

**Note**: Updating amount will NOT automatically reverse and re-apply account balance. You may need to handle this manually or delete and recreate.

---

### 4. Delete Receipt

**Endpoint**: `POST /receipts/deleteReceipt`

**Request Body**:
```json
{
  "id": 10
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Receipt deleted successfully."
}
```

**Response** (Error - 500):
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Error message details"
}
```

**What Happens Automatically**:
- ✅ Account balance is reversed (amount is subtracted)
- ✅ Account history record is deleted
- ✅ Receipt record is deleted

---

## 📊 Request Fields Details

### Required Fields (Create Receipt)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `date` | string | Receipt date (YYYY-MM-DD) | "2024-01-15" |
| `amount` | number | Receipt amount (decimal) | 5000.00 |
| `contact_id` | number | ID from contacts table | 3 |
| `account_id` | number | ID from accounts table | 1 |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `description` | string | Receipt description | "Payment received" |
| `reference` | string | Reference number | "REF001" |
| `note` | string | Additional notes | "Monthly payment" |
| `customer_id` | number | Customer ID (for invoice cascading) | 5 |
| `image` | file | Receipt image (jpeg, jpg, png, gif, max 10MB) | [File] |

---

## 📤 Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Receipt ID |
| `date` | string | Receipt date |
| `amount` | string | Receipt amount (as decimal string) |
| `contact_id` | number | Contact ID |
| `account_id` | number | Account ID |
| `description` | string/null | Description |
| `reference` | string/null | Reference number |
| `note` | string/null | Notes |
| `image_url` | string/null | Path to uploaded image |
| `user_id` | number | User who created the receipt |
| `created_at` | string | Creation timestamp |
| `updated_at` | string | Last update timestamp |

---

## 🔄 Automatic Operations

When a receipt is created, the system automatically:

1. **Account Balance Update**
   - Adds the amount to the specified account balance
   - Formula: `account.balance = account.balance + receipt.amount`

2. **Account History Creation**
   - Creates a CREDIT entry in `account_history` table
   - Records customer information
   - Stores balance after transaction

3. **Customer Details Update** (if contact is Customer type)
   - Updates `customer_details.total_amount`
   - Updates `customer_details.no_1` or `customer_details.no_2` based on account name

4. **Invoice Payment Cascading** (if customer_id provided)
   - Automatically applies payment to customer invoices
   - Pays oldest invoices first
   - Updates `invoices.remaining_amount`

When a receipt is deleted:
- Account balance is reversed (amount subtracted)
- Account history record is deleted
- Receipt record is deleted

---

## 📝 Example Usage

### Example 1: Create Receipt with Image

```javascript
// Using FormData
const formData = new FormData();
formData.append('date', '2024-01-15');
formData.append('amount', '5000.00');
formData.append('contact_id', '3');
formData.append('account_id', '1');
formData.append('description', 'Payment received');
formData.append('reference', 'REF001');
formData.append('image', fileInput.files[0]);

fetch('http://localhost:3000/receipts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <your_token>'
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

### Example 2: Create Receipt without Image

```javascript
fetch('http://localhost:3000/receipts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <your_token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    date: '2024-01-15',
    amount: 5000.00,
    contact_id: 3,
    account_id: 1,
    description: 'Payment received',
    reference: 'REF001'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Example 3: Get All Receipts

```javascript
fetch('http://localhost:3000/receipts/getAllReceipt', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <your_token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
})
.then(res => res.json())
.then(data => console.log(data));
```

### Example 4: Update Receipt

```javascript
fetch('http://localhost:3000/receipts/updateReceipt', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <your_token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: 10,
    amount: 6000.00,
    description: 'Updated description'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Example 5: Delete Receipt

```javascript
fetch('http://localhost:3000/receipts/deleteReceipt', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <your_token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: 10
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized: No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden: You don't have permission to access this resource."
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error",
  "error": "Detailed error message"
}
```

---

## 📋 File Upload Specifications

- **Allowed Types**: jpeg, jpg, png, gif
- **Max File Size**: 10MB
- **Storage Location**: `./uploads/`
- **File Naming**: `image-{timestamp}{extension}`
- **Field Name**: `image`

---

## 🔐 Authentication

All endpoints require:
- **Header**: `Authorization: Bearer <jwt_token>`
- **Permission**: `receipts` permission in user's permissions

---

## 📝 Notes

1. **Amount Format**: Use decimal numbers (e.g., 5000.00)
2. **Date Format**: Use YYYY-MM-DD format
3. **Image Upload**: Optional, but if provided, must be valid image file
4. **Account Balance**: Automatically updated when receipt is created/deleted
5. **Account History**: Automatically created when receipt is created
6. **Update Limitations**: Updating amount doesn't automatically adjust account balance

---

*Last Updated: Based on current codebase*

