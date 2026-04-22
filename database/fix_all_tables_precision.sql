-- ============================================
-- Fix ALL Numeric Columns - Complete Solution
-- ============================================
-- This script fixes precision issues in ALL tables
-- Run this to ensure all numeric fields store exact values

-- ============================================
-- 1. MASTER ITEMS TABLE
-- ============================================
ALTER TABLE master_items 
  MODIFY COLUMN kg_dz DECIMAL(15, 6),
  MODIFY COLUMN stock_quantity DECIMAL(15, 6),
  MODIFY COLUMN stock_kg DECIMAL(15, 6);

-- ============================================
-- 2. INVENTORY ITEMS TABLE
-- ============================================
ALTER TABLE inventory_items 
  MODIFY COLUMN scrap DECIMAL(15, 6),
  MODIFY COLUMN labour DECIMAL(15, 6),
  MODIFY COLUMN kg_dzn DECIMAL(15, 6),
  MODIFY COLUMN pcs_box DECIMAL(15, 6),
  MODIFY COLUMN box_ctn DECIMAL(15, 6),
  MODIFY COLUMN pcs_ctn DECIMAL(15, 6),
  MODIFY COLUMN kg_box DECIMAL(15, 6),
  MODIFY COLUMN empty_wt DECIMAL(15, 6),
  MODIFY COLUMN actual_wt DECIMAL(15, 6),
  MODIFY COLUMN rate_pcs DECIMAL(15, 6),
  MODIFY COLUMN base_rate_pcs DECIMAL(15, 6),
  MODIFY COLUMN rate_kg DECIMAL(15, 6),
  MODIFY COLUMN stock_quantity DECIMAL(15, 6);

-- ============================================
-- 3. SALES ORDERS TABLE
-- ============================================
ALTER TABLE sales_orders 
  MODIFY COLUMN quantity_pcs DECIMAL(15, 6),
  MODIFY COLUMN rate_kz DECIMAL(15, 6),
  MODIFY COLUMN initial_qty DECIMAL(15, 6);

-- ============================================
-- 4. INVOICES TABLE (Sales Invoices)
-- ============================================
ALTER TABLE invoices 
  MODIFY COLUMN total_net_kg DECIMAL(15, 6),
  MODIFY COLUMN grand_total DECIMAL(15, 2),
  MODIFY COLUMN reference_no_1 DECIMAL(15, 6),
  MODIFY COLUMN reference_no_2 DECIMAL(15, 6),
  MODIFY COLUMN remaining_amount DECIMAL(15, 2);

-- ============================================
-- 5. INVOICE ITEMS TABLE
-- ============================================
ALTER TABLE invoice_items 
  MODIFY COLUMN total_pcs DECIMAL(15, 6),
  MODIFY COLUMN net_kg DECIMAL(15, 6),
  MODIFY COLUMN rate_pcs DECIMAL(15, 6),
  MODIFY COLUMN rate_kg DECIMAL(15, 6),
  MODIFY COLUMN amount DECIMAL(15, 2);

-- ============================================
-- 6. PURCHASE INVOICES TABLE
-- ============================================
ALTER TABLE purchase_invoices 
  MODIFY COLUMN total_amount DECIMAL(15, 2),
  MODIFY COLUMN balance_due DECIMAL(15, 2);

-- ============================================
-- 7. PURCHASE INVOICE ITEMS TABLE
-- ============================================
ALTER TABLE purchase_invoice_items 
  MODIFY COLUMN total_psc DECIMAL(15, 6),
  MODIFY COLUMN net_kg DECIMAL(15, 6),
  MODIFY COLUMN total_kg DECIMAL(15, 6),
  MODIFY COLUMN no_of_peti DECIMAL(15, 6),
  MODIFY COLUMN ret_peti_no DECIMAL(15, 6),
  MODIFY COLUMN peti_balance DECIMAL(15, 6),
  MODIFY COLUMN amount DECIMAL(15, 2);

-- ============================================
-- 8. STOCK HISTORY TABLE (if exists)
-- ============================================
ALTER TABLE stock_history 
  MODIFY COLUMN quantity_pcs DECIMAL(15, 6),
  MODIFY COLUMN quantity_kg DECIMAL(15, 6);

-- ============================================
-- 9. CONTACTS TABLE
-- ============================================
ALTER TABLE contacts 
  MODIFY COLUMN opening_balance DECIMAL(15, 2);

-- ============================================
-- 10. CUSTOMER DETAILS TABLE (if exists)
-- ============================================
ALTER TABLE customer_details 
  MODIFY COLUMN total_amount DECIMAL(15, 2),
  MODIFY COLUMN no_1 DECIMAL(15, 6),
  MODIFY COLUMN no_2 DECIMAL(15, 6),
  MODIFY COLUMN credit_period DECIMAL(15, 6);

-- ============================================
-- 11. SUPPLIER DETAILS TABLE (if exists)
-- ============================================
ALTER TABLE supplier_details 
  MODIFY COLUMN total_amount DECIMAL(15, 2);

-- ============================================
-- 12. RECEIPTS TABLE
-- ============================================
ALTER TABLE receipts 
  MODIFY COLUMN amount DECIMAL(15, 2);

-- ============================================
-- 13. PAYMENTS TABLE
-- ============================================
ALTER TABLE payments 
  MODIFY COLUMN amount DECIMAL(15, 2);

-- ============================================
-- 14. ACCOUNT HISTORY TABLE
-- ============================================
ALTER TABLE account_history 
  MODIFY COLUMN amount DECIMAL(15, 2);

-- ============================================
-- 15. ACCOUNTS TABLE
-- ============================================
ALTER TABLE accounts 
  MODIFY COLUMN balance DECIMAL(15, 2);

-- ============================================
-- 16. CARTON INVENTORY TABLE
-- ============================================
ALTER TABLE carton_inventory 
  MODIFY COLUMN carton_quantity DECIMAL(15, 6);

-- ============================================
-- 17. SHIPPING CARTONS TABLE (if exists)
-- ============================================
ALTER TABLE shipping_cartons 
  MODIFY COLUMN carton_weight DECIMAL(15, 6);

-- ============================================
-- 18. EMPLOYEE WEEKLY SALARY TABLE (if exists)
-- ============================================
ALTER TABLE employee_weekly_salary 
  MODIFY COLUMN total_hours DECIMAL(15, 2),
  MODIFY COLUMN hourly_rate DECIMAL(15, 2),
  MODIFY COLUMN total_salary DECIMAL(15, 2);

-- ============================================
-- 19. EMPLOYEE ADVANCE TABLE (if exists)
-- ============================================
ALTER TABLE employee_advance 
  MODIFY COLUMN amount DECIMAL(15, 2);

-- ============================================
-- 20. JOURNAL ENTRIES TABLE (if exists)
-- ============================================
ALTER TABLE journal_entries 
  MODIFY COLUMN amount DECIMAL(15, 2);

-- ============================================
-- NOTES:
-- ============================================
-- DECIMAL(15, 6) = For quantities, weights, rates
--   - Allows: 123456789.123456
--   - Good for: kg_dz, stock_quantity, rate_pcs, etc.
--
-- DECIMAL(15, 2) = For money/currency
--   - Allows: 1234567890123.12
--   - Good for: total_amount, grand_total, balance, etc.
--
-- If you need MORE precision (like 10 decimals):
-- Use DECIMAL(15, 10) instead of DECIMAL(15, 6)
-- ============================================

-- ============================================
-- AFTER RUNNING THIS:
-- ============================================
-- Test with:
-- UPDATE master_items SET kg_dz = 1.582 WHERE id = 251;
-- SELECT kg_dz FROM master_items WHERE id = 251;
-- Should return: 1.582000 ✅
-- ============================================
