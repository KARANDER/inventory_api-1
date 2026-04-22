# How to Fix Numeric Precision Issues

**Problem:** Values like `1.582` become `1.580` after saving to database

**Cause:** Database columns only store 2 decimal places

**Solution:** Update column precision to store more decimals

---

## 🚀 Quick Fix (3 Steps)

### Step 1: Check What Needs Fixing

Run this SQL to see all columns with precision issues:

```bash
mysql -u your_user -p your_database < database/check_all_numeric_columns.sql
```

Or in your database tool, run:

```sql
-- See file: database/check_all_numeric_columns.sql
```

This shows you which columns need fixing.

---

### Step 2: Fix ALL Tables

**Option A: Complete Fix (Recommended)**

Run this to fix ALL tables at once:

```bash
mysql -u your_user -p your_database < database/fix_all_tables_precision.sql
```

**Option B: Safe Fix (If unsure which tables exist)**

```bash
mysql -u your_user -p your_database < database/fix_precision_safe.sql
```

**Option C: Manual Fix (One table at a time)**

```sql
-- Just fix master_items
ALTER TABLE master_items
  MODIFY COLUMN kg_dz DECIMAL(15, 6);
```

---

### Step 3: Test It Works

```sql
-- Update a value
UPDATE master_items SET kg_dz = 1.582 WHERE id = 251;

-- Check if it's stored correctly
SELECT kg_dz FROM master_items WHERE id = 251;

-- Should return: 1.582000 ✅ (not 1.580000)
```

---

## 📁 Files Created

| File                            | Purpose                              |
| ------------------------------- | ------------------------------------ |
| `check_all_numeric_columns.sql` | Shows ALL columns that need fixing   |
| `fix_all_tables_precision.sql`  | Fixes ALL tables (complete solution) |
| `fix_precision_safe.sql`        | Safe version (skips missing tables)  |
| `check_column_types.sql`        | Check specific table columns         |

---

## 🎯 What Gets Fixed

### Before:

```
DECIMAL(10, 2)  → Only 2 decimals
1.582 → 1.58 ❌
```

### After:

```
DECIMAL(15, 6)  → Up to 6 decimals
1.582 → 1.582 ✅
```

---

## 📊 Tables That Will Be Fixed

✅ master_items  
✅ inventory_items  
✅ sales_orders  
✅ invoices  
✅ invoice_items  
✅ purchase_invoices  
✅ purchase_invoice_items  
✅ stock_history  
✅ contacts  
✅ customer_details  
✅ supplier_details  
✅ receipts  
✅ payments  
✅ accounts  
✅ carton_inventory  
✅ employee_weekly_salary  
✅ employee_advance  
✅ journal_entries

---

## ⚠️ Important Notes

1. **Backup First:** Always backup your database before running ALTER TABLE

   ```bash
   mysqldump -u user -p database > backup.sql
   ```

2. **Takes Time:** ALTER TABLE can take a few minutes on large tables

3. **No Data Loss:** This only changes precision, doesn't delete data

4. **One-Time Fix:** You only need to run this once

---

## 🔍 Verify After Running

Check a few tables to confirm:

```sql
-- Check master_items
SELECT COLUMN_NAME, COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'master_items'
AND COLUMN_NAME IN ('kg_dz', 'stock_quantity');

-- Should show: decimal(15,6)
```

---

## 💡 Quick Reference

**For quantities/weights/rates:**

- Use: `DECIMAL(15, 6)` - Stores up to 6 decimals
- Example: 123456789.123456

**For money/currency:**

- Use: `DECIMAL(15, 2)` - Stores 2 decimals
- Example: 1234567890123.12

**Need more precision?**

- Use: `DECIMAL(15, 10)` - Stores up to 10 decimals
- Example: 12345.1234567890

---

## ✅ Success Checklist

- [ ] Backed up database
- [ ] Ran `check_all_numeric_columns.sql` to see issues
- [ ] Ran `fix_all_tables_precision.sql` to fix all tables
- [ ] Tested with: `UPDATE master_items SET kg_dz = 1.582 WHERE id = 251`
- [ ] Verified: `SELECT kg_dz FROM master_items WHERE id = 251` returns `1.582000`
- [ ] Tested your application to ensure everything works

---

## 🆘 Troubleshooting

**Error: "Table doesn't exist"**

- Use `fix_precision_safe.sql` instead
- Or comment out tables you don't have

**Error: "Column doesn't exist"**

- Check your actual column names
- Modify the SQL to match your schema

**Still getting rounded values?**

- Clear your application cache
- Restart your backend server
- Check if there's any `.toFixed()` in your code

---

**Status:** Ready to run!  
**Time Required:** 5-10 minutes  
**Risk Level:** Low (only changes precision, no data loss)
