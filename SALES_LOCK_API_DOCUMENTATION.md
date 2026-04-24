# Sales Lock System - API Documentation

## Overview

The Sales Lock system allows users to globally lock/unlock sales operations. When locked, **no user** can create sales orders or sales invoices.

---

## Database Setup

**Run this SQL first:**

```sql
-- File: database/sales_lock_table.sql
CREATE TABLE IF NOT EXISTS sales_lock (
  id INT PRIMARY KEY AUTO_INCREMENT,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  locked_by INT NULL,
  locked_at TIMESTAMP NULL,
  unlocked_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (locked_by) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO sales_lock (is_locked) VALUES (FALSE);
```

---

## API Endpoints

### 1. Get Lock Status

**Endpoint:** `GET /sales-lock/status`

**Headers:**

```json
{
  "Authorization": "Bearer <token>"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "is_locked": false,
    "locked_by": null,
    "locked_at": null,
    "unlocked_at": "2026-04-24T10:30:00.000Z"
  }
}
```

---

### 2. Toggle Lock ON/OFF

**Endpoint:** `POST /sales-lock/toggle`

**Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body (Lock ON):**

```json
{
  "is_locked": true
}
```

**Request Body (Lock OFF):**

```json
{
  "is_locked": false
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Sales operations locked successfully.",
  "data": {
    "is_locked": true,
    "locked_by": 5,
    "locked_at": "2026-04-24T10:35:00.000Z",
    "unlocked_at": null
  }
}
```

---

## Frontend Implementation

### 1. Auto Logout Timer (5 Minutes)

```javascript
// Auto logout after 5 minutes of inactivity
let logoutTimer;
const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes

function autoLogout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

function resetTimer() {
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(autoLogout, TIMEOUT_DURATION);
}

// Track user activity
document.addEventListener("mousemove", resetTimer);
document.addEventListener("keypress", resetTimer);
document.addEventListener("click", resetTimer);
document.addEventListener("scroll", resetTimer);

// Start timer on page load
resetTimer();
```

---

### 2. Sales Lock Toggle Component

```javascript
import { useState, useEffect } from "react";

function SalesLockToggle() {
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get current lock status on component mount
  useEffect(() => {
    fetchLockStatus();
  }, []);

  const fetchLockStatus = async () => {
    try {
      const response = await fetch(
        "https://mainapi.otix.in/sales-lock/status",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setIsLocked(data.data.is_locked);
      }
    } catch (error) {
      console.error("Error fetching lock status:", error);
    }
  };

  const toggleLock = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://mainapi.otix.in/sales-lock/toggle",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_locked: !isLocked }),
        },
      );

      const data = await response.json();
      if (data.success) {
        setIsLocked(data.data.is_locked);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error toggling lock:", error);
      alert("Failed to toggle lock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isLocked}
          onChange={toggleLock}
          disabled={loading}
        />
        {isLocked ? "Sales Locked 🔒" : "Sales Unlocked 🔓"}
      </label>
    </div>
  );
}
```

---

### 3. Handle Lock Errors When Creating Sales Orders/Invoices

When creating sales orders or invoices, the API will return error if locked:

```javascript
// Example: Creating Sales Order
const createSalesOrder = async (orderData) => {
  try {
    const response = await fetch(
      "https://mainapi.otix.in/sales-orders/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      },
    );

    const data = await response.json();

    if (!data.success) {
      // Check if it's a lock error
      if (response.status === 403) {
        alert(
          "⚠️ Sales operations are currently locked. Cannot create sales orders.",
        );
      } else {
        alert(data.message);
      }
      return;
    }

    // Success
    alert("Sales order created successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## Error Responses

### When Sales is Locked (403 Forbidden)

**Creating Sales Order:**

```json
{
  "success": false,
  "message": "Sales operations are currently locked. Cannot create sales orders."
}
```

**Creating Sales Invoice:**

```json
{
  "success": false,
  "message": "Sales operations are currently locked. Cannot create sales invoices."
}
```

---

## Summary

✅ **Auto Logout:** Frontend-only, 5-minute inactivity timer  
✅ **Sales Lock:** Global lock for all users  
✅ **Toggle Access:** Any authenticated user can toggle  
✅ **Blocks:** CREATE sales orders and CREATE sales invoices  
✅ **Allows:** VIEW operations still work

---

## Testing

1. **Run SQL:** Execute `database/sales_lock_table.sql`
2. **Test Lock Status:** `GET /sales-lock/status`
3. **Test Toggle ON:** `POST /sales-lock/toggle` with `{"is_locked": true}`
4. **Test Create Block:** Try creating sales order → Should get 403 error
5. **Test Toggle OFF:** `POST /sales-lock/toggle` with `{"is_locked": false}`
6. **Test Create Success:** Try creating sales order → Should work
