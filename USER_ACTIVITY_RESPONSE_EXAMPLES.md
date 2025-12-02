# User Activity History - Example Responses for All Models

## Base Response Structure

All responses follow this format:
```json
{
  "success": true,
  "data": [...],
  "count": number
}
```

---

## 1. ACCOUNTS Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "user_name": "John Doe",
      "model_name": "accounts",
      "action_type": "CREATE",
      "record_id": 10,
      "description": "Created account",
      "changes": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
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
        },
        "code": {
          "old": "ACC001",
          "new": "ACC002"
        }
      },
      "created_at": "2024-01-15T11:00:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "user_id": 5,
      "user_name": "John Doe",
      "model_name": "accounts",
      "action_type": "DELETE",
      "record_id": 10,
      "description": "Deleted account",
      "changes": null,
      "created_at": "2024-01-15T11:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 2. CONTACTS Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 4,
      "user_id": 3,
      "user_name": "Jane Smith",
      "model_name": "contacts",
      "action_type": "CREATE",
      "record_id": 25,
      "description": "Created contact",
      "changes": null,
      "created_at": "2024-01-15T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "user_id": 3,
      "user_name": "Jane Smith",
      "model_name": "contacts",
      "action_type": "UPDATE",
      "record_id": 25,
      "description": "Updated contact",
      "changes": {
        "contact_name": {
          "old": "ABC Company",
          "new": "ABC Corporation"
        },
        "email": {
          "old": "old@example.com",
          "new": "new@example.com"
        },
        "code": {
          "old": "CUST001",
          "new": "CUST002"
        }
      },
      "created_at": "2024-01-15T12:30:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 6,
      "user_id": 3,
      "user_name": "Jane Smith",
      "model_name": "contacts",
      "action_type": "DELETE",
      "record_id": 25,
      "description": "Deleted contact",
      "changes": null,
      "created_at": "2024-01-15T13:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 3. INVENTORY_ITEMS Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 7,
      "user_id": 2,
      "user_name": "Mike Johnson",
      "model_name": "inventory_items",
      "action_type": "CREATE",
      "record_id": 50,
      "description": "Created inventory item",
      "changes": null,
      "created_at": "2024-01-15T14:00:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "user_id": 2,
      "user_name": "Mike Johnson",
      "model_name": "inventory_items",
      "action_type": "UPDATE",
      "record_id": 50,
      "description": "Updated inventory item",
      "changes": {
        "item_code": {
          "old": "ITEM001",
          "new": "ITEM002"
        },
        "stock_quantity": {
          "old": 100,
          "new": 150
        },
        "user": {
          "old": "SUP001",
          "new": "SUP002"
        }
      },
      "created_at": "2024-01-15T14:30:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 9,
      "user_id": 2,
      "user_name": "Mike Johnson",
      "model_name": "inventory_items",
      "action_type": "DELETE",
      "record_id": 50,
      "description": "Deleted inventory item",
      "changes": null,
      "created_at": "2024-01-15T15:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 4. MASTER_ITEMS Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "user_id": 4,
      "user_name": "Sarah Williams",
      "model_name": "master_items",
      "action_type": "CREATE",
      "record_id": 75,
      "description": "Created master item",
      "changes": null,
      "created_at": "2024-01-15T16:00:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 11,
      "user_id": 4,
      "user_name": "Sarah Williams",
      "model_name": "master_items",
      "action_type": "UPDATE",
      "record_id": 75,
      "description": "Updated master item",
      "changes": {
        "item_code": {
          "old": "MASTER001",
          "new": "MASTER002"
        },
        "description": {
          "old": "Item Description Old",
          "new": "Item Description New"
        },
        "kg_dz": {
          "old": 5.5,
          "new": 6.0
        },
        "stock_quantity": {
          "old": 200,
          "new": 250
        },
        "stock_kg": {
          "old": 1100.00,
          "new": 1500.00
        }
      },
      "created_at": "2024-01-15T16:30:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "user_id": 4,
      "user_name": "Sarah Williams",
      "model_name": "master_items",
      "action_type": "DELETE",
      "record_id": 75,
      "description": "Deleted master item",
      "changes": null,
      "created_at": "2024-01-15T17:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 5. SALES_ORDERS Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 13,
      "user_id": 1,
      "user_name": "Admin User",
      "model_name": "sales_orders",
      "action_type": "CREATE",
      "record_id": 100,
      "description": "Created sales order",
      "changes": null,
      "created_at": "2024-01-15T18:00:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 14,
      "user_id": 1,
      "user_name": "Admin User",
      "model_name": "sales_orders",
      "action_type": "UPDATE",
      "record_id": 100,
      "description": "Updated sales order",
      "changes": {
        "order_number": {
          "old": "SO-001",
          "new": "SO-002"
        },
        "order_date": {
          "old": "2024-01-10",
          "new": "2024-01-15"
        },
        "quantity_pcs": {
          "old": 500,
          "new": 600
        },
        "total_kg": {
          "old": 250.50,
          "new": 300.75
        },
        "rate_pcs": {
          "old": 10.00,
          "new": 12.00
        }
      },
      "created_at": "2024-01-15T18:30:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "user_id": 1,
      "user_name": "Admin User",
      "model_name": "sales_orders",
      "action_type": "DELETE",
      "record_id": 100,
      "description": "Deleted sales order",
      "changes": null,
      "created_at": "2024-01-15T19:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 6. SALES_INVOICES Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 16,
      "user_id": 5,
      "user_name": "John Doe",
      "model_name": "sales_invoices",
      "action_type": "CREATE",
      "record_id": 200,
      "description": "Created sales invoice INV-001",
      "changes": null,
      "created_at": "2024-01-15T20:00:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 17,
      "user_id": 5,
      "user_name": "John Doe",
      "model_name": "sales_invoices",
      "action_type": "UPDATE",
      "record_id": 200,
      "description": "Updated sales invoice",
      "changes": {
        "invoice_no": {
          "old": "INV-001",
          "new": "INV-002"
        },
        "customer": {
          "old": "Customer A",
          "new": "Customer B"
        },
        "invoice_date": {
          "old": "2024-01-10",
          "new": "2024-01-15"
        },
        "due_date": {
          "old": "2024-02-10",
          "new": "2024-02-15"
        },
        "status": {
          "old": "pending",
          "new": "paid"
        },
        "no1": {
          "old": 1000.00,
          "new": 1200.00
        },
        "no2": {
          "old": 500.00,
          "new": 600.00
        }
      },
      "created_at": "2024-01-15T20:30:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 18,
      "user_id": 5,
      "user_name": "John Doe",
      "model_name": "sales_invoices",
      "action_type": "DELETE",
      "record_id": 200,
      "description": "Deleted sales invoice",
      "changes": null,
      "created_at": "2024-01-15T21:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 7. PURCHASE_INVOICES Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 19,
      "user_id": 3,
      "user_name": "Jane Smith",
      "model_name": "purchase_invoices",
      "action_type": "CREATE",
      "record_id": 300,
      "description": "Created purchase invoice PI-001",
      "changes": null,
      "created_at": "2024-01-15T22:00:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 20,
      "user_id": 3,
      "user_name": "Jane Smith",
      "model_name": "purchase_invoices",
      "action_type": "UPDATE",
      "record_id": 300,
      "description": "Updated purchase invoice",
      "changes": {
        "invoice_number": {
          "old": "PI-001",
          "new": "PI-002"
        },
        "code_user": {
          "old": "SUP001",
          "new": "SUP002"
        },
        "issue_date": {
          "old": "2024-01-10",
          "new": "2024-01-15"
        }
      },
      "created_at": "2024-01-15T22:30:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 21,
      "user_id": 3,
      "user_name": "Jane Smith",
      "model_name": "purchase_invoices",
      "action_type": "DELETE",
      "record_id": 300,
      "description": "Deleted purchase invoice",
      "changes": null,
      "created_at": "2024-01-15T23:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 8. INVOICES Model (New Sales Invoice)

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 22,
      "user_id": 2,
      "user_name": "Mike Johnson",
      "model_name": "invoices",
      "action_type": "CREATE",
      "record_id": 400,
      "description": "Created invoice INV-NEW-001",
      "changes": null,
      "created_at": "2024-01-16T09:00:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 23,
      "user_id": 2,
      "user_name": "Mike Johnson",
      "model_name": "invoices",
      "action_type": "UPDATE",
      "record_id": 400,
      "description": "Updated invoice",
      "changes": {
        "invoice_number": {
          "old": "INV-NEW-001",
          "new": "INV-NEW-002"
        },
        "invoice_date": {
          "old": "2024-01-10",
          "new": "2024-01-16"
        },
        "customer_id": {
          "old": "CUST001",
          "new": "CUST002"
        },
        "grand_total": {
          "old": 5000.00,
          "new": 6000.00
        },
        "remaining_amount": {
          "old": 5000.00,
          "new": 6000.00
        }
      },
      "created_at": "2024-01-16T09:30:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 24,
      "user_id": 2,
      "user_name": "Mike Johnson",
      "model_name": "invoices",
      "action_type": "DELETE",
      "record_id": 400,
      "description": "Deleted invoice",
      "changes": null,
      "created_at": "2024-01-16T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 9. FINISHES Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 25,
      "user_id": 4,
      "user_name": "Sarah Williams",
      "model_name": "finishes",
      "action_type": "CREATE",
      "record_id": 500,
      "description": "Created finish",
      "changes": null,
      "created_at": "2024-01-16T11:00:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 26,
      "user_id": 4,
      "user_name": "Sarah Williams",
      "model_name": "finishes",
      "action_type": "UPDATE",
      "record_id": 500,
      "description": "Updated finish",
      "changes": {
        "finish": {
          "old": "Finish Type A",
          "new": "Finish Type B"
        }
      },
      "created_at": "2024-01-16T11:30:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 27,
      "user_id": 4,
      "user_name": "Sarah Williams",
      "model_name": "finishes",
      "action_type": "DELETE",
      "record_id": 500,
      "description": "Deleted finish",
      "changes": null,
      "created_at": "2024-01-16T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 10. ORDER_STOCK Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 28,
      "user_id": 1,
      "user_name": "Admin User",
      "model_name": "order_stock",
      "action_type": "CREATE",
      "record_id": 600,
      "description": "Created order stock",
      "changes": null,
      "created_at": "2024-01-16T13:00:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 29,
      "user_id": 1,
      "user_name": "Admin User",
      "model_name": "order_stock",
      "action_type": "UPDATE",
      "record_id": 600,
      "description": "Updated order stock",
      "changes": {
        "order_stock": {
          "old": "Stock Type A",
          "new": "Stock Type B"
        }
      },
      "created_at": "2024-01-16T13:30:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 30,
      "user_id": 1,
      "user_name": "Admin User",
      "model_name": "order_stock",
      "action_type": "DELETE",
      "record_id": 600,
      "description": "Deleted order stock",
      "changes": null,
      "created_at": "2024-01-16T14:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 11. TRANSPORT Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 31,
      "user_id": 5,
      "user_name": "John Doe",
      "model_name": "transport",
      "action_type": "CREATE",
      "record_id": 700,
      "description": "Created transport Transport Company A",
      "changes": null,
      "created_at": "2024-01-16T15:00:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 32,
      "user_id": 5,
      "user_name": "John Doe",
      "model_name": "transport",
      "action_type": "UPDATE",
      "record_id": 700,
      "description": "Updated transport Transport Company B",
      "changes": {
        "name": {
          "old": "Transport Company A",
          "new": "Transport Company B"
        }
      },
      "created_at": "2024-01-16T15:30:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 33,
      "user_id": 5,
      "user_name": "John Doe",
      "model_name": "transport",
      "action_type": "DELETE",
      "record_id": 700,
      "description": "Deleted transport",
      "changes": null,
      "created_at": "2024-01-16T16:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 12. CARTON_INVENTORY Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 34,
      "user_id": 3,
      "user_name": "Jane Smith",
      "model_name": "carton_inventory",
      "action_type": "CREATE",
      "record_id": 800,
      "description": "Created carton Carton-A",
      "changes": null,
      "created_at": "2024-01-16T17:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 13. PATI Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 35,
      "user_id": 2,
      "user_name": "Mike Johnson",
      "model_name": "pati",
      "action_type": "CREATE",
      "record_id": 900,
      "description": "Created PATI record",
      "changes": null,
      "created_at": "2024-01-16T18:00:00.000Z"
    }
  ],
  "count": 1
}
```

### UPDATE Action (with changes)
```json
{
  "success": true,
  "data": [
    {
      "id": 36,
      "user_id": 2,
      "user_name": "Mike Johnson",
      "model_name": "pati",
      "action_type": "UPDATE",
      "record_id": 900,
      "description": "Updated PATI record",
      "changes": {
        "pati_type": {
          "old": "Type A",
          "new": "Type B"
        }
      },
      "created_at": "2024-01-16T18:30:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 37,
      "user_id": 2,
      "user_name": "Mike Johnson",
      "model_name": "pati",
      "action_type": "DELETE",
      "record_id": 900,
      "description": "Deleted PATI record",
      "changes": null,
      "created_at": "2024-01-16T19:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 14. USERS Model

### CREATE Action (User Registration)
```json
{
  "success": true,
  "data": [
    {
      "id": 38,
      "user_id": 1,
      "user_name": "Admin User",
      "model_name": "users",
      "action_type": "CREATE",
      "record_id": 6,
      "description": "Created user NewUser",
      "changes": null,
      "created_at": "2024-01-16T20:00:00.000Z"
    }
  ],
  "count": 1
}
```

### LOGIN Action
```json
{
  "success": true,
  "data": [
    {
      "id": 39,
      "user_id": 5,
      "user_name": "John Doe",
      "model_name": "users",
      "action_type": "LOGIN",
      "record_id": 5,
      "description": "User John Doe logged in",
      "changes": null,
      "created_at": "2024-01-16T21:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 15. RECEIPTS Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 40,
      "user_id": 4,
      "user_name": "Sarah Williams",
      "model_name": "receipts",
      "action_type": "CREATE",
      "record_id": 1000,
      "description": "Created receipt",
      "changes": null,
      "created_at": "2024-01-16T22:00:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 41,
      "user_id": 4,
      "user_name": "Sarah Williams",
      "model_name": "receipts",
      "action_type": "DELETE",
      "record_id": 1000,
      "description": "Deleted receipt",
      "changes": null,
      "created_at": "2024-01-16T22:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 16. PAYMENTS Model

### CREATE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "user_id": 3,
      "user_name": "Jane Smith",
      "model_name": "payments",
      "action_type": "CREATE",
      "record_id": 1100,
      "description": "Created payment",
      "changes": null,
      "created_at": "2024-01-16T23:00:00.000Z"
    }
  ],
  "count": 1
}
```

### DELETE Action
```json
{
  "success": true,
  "data": [
    {
      "id": 43,
      "user_id": 3,
      "user_name": "Jane Smith",
      "model_name": "payments",
      "action_type": "DELETE",
      "record_id": 1100,
      "description": "Deleted payment",
      "changes": null,
      "created_at": "2024-01-16T23:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

## Multiple Records Response Example

When fetching multiple records:

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
        }
      },
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "user_id": 3,
      "user_name": "Jane Smith",
      "model_name": "contacts",
      "action_type": "CREATE",
      "record_id": 25,
      "description": "Created contact",
      "changes": null,
      "created_at": "2024-01-15T12:00:00.000Z"
    },
    {
      "id": 3,
      "user_id": 2,
      "user_name": "Mike Johnson",
      "model_name": "sales_orders",
      "action_type": "DELETE",
      "record_id": 100,
      "description": "Deleted sales order",
      "changes": null,
      "created_at": "2024-01-15T19:00:00.000Z"
    }
  ],
  "count": 3
}
```

---

## Notes:

1. **Changes Field**: 
   - Only `UPDATE` actions have the `changes` field populated
   - `CREATE` and `DELETE` actions have `changes: null`
   - `LOGIN` actions have `changes: null`

2. **Changes Format**:
   - Each changed field shows `old` and `new` values
   - Only fields that actually changed are included
   - Data types are preserved (strings, numbers, dates, etc.)

3. **Record ID**:
   - Points to the primary key of the affected record
   - Can be used to fetch the full record details if needed

4. **Timestamp**:
   - `created_at` is in ISO 8601 format
   - Shows when the action was logged

5. **Description**:
   - Human-readable description of the action
   - May include additional context (e.g., invoice numbers)

