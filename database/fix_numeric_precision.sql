-- ============================================
-- Fix Numeric Field Precision
-- ============================================
-- This fixes the precision issue where 1.582 becomes 1.580
-- Run this SQL in your database to allow more decimal places

-- Master Items Table
ALTER TABLE master_items 
  MODIFY COLUMN kg_dz DECIMAL(15, 6),
  MODIFY COLUMN stock_quantity DECIMAL(15, 6),
  MODIFY COLUMN stock_kg DECIMAL(15, 6);

-- Inventory Items Table
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

-- Sales Orders Table
ALTER TABLE sales_orders 
  MODIFY COLUMN quantity_pcs DECIMAL(15, 6),
  MODIFY COLUMN rate_kz DECIMAL(15, 6),
  MODIFY COLUMN initial_qty DECIMAL(15, 6);

-- Invoice Items Table (if exists)
ALTER TABLE invoice_items 
  MODIFY COLUMN total_pcs DECIMAL(15, 6),
  MODIFY COLUMN net_kg DECIMAL(15, 6),
  MODIFY COLUMN rate_pcs DECIMAL(15, 6),
  MODIFY COLUMN rate_kg DECIMAL(15, 6);

-- Purchase Invoice Items Table
ALTER TABLE purchase_invoice_items 
  MODIFY COLUMN total_psc DECIMAL(15, 6),
  MODIFY COLUMN net_kg DECIMAL(15, 6),
  MODIFY COLUMN total_kg DECIMAL(15, 6),
  MODIFY COLUMN no_of_peti DECIMAL(15, 6),
  MODIFY COLUMN ret_peti_no DECIMAL(15, 6),
  MODIFY COLUMN peti_balance DECIMAL(15, 6);

-- Invoices Table
ALTER TABLE invoices 
  MODIFY COLUMN total_net_kg DECIMAL(15, 6);

-- Purchase Invoices Table
ALTER TABLE purchase_invoices 
  MODIFY COLUMN total_amount DECIMAL(15, 6),
  MODIFY COLUMN balance_due DECIMAL(15, 6);

-- ============================================
-- Why DECIMAL(15, 6)?
-- ============================================
-- 15 = Total digits (including decimals)
-- 6 = Decimal places
-- 
-- Examples of what it can store:
-- 123456789.123456 ✅
-- 1.582 ✅
-- 2.001 ✅
-- 3.14159265 ❌ (would be 3.141593 - rounded to 6 decimals)
--
-- If you need more precision, use DECIMAL(15, 10):
-- ALTER TABLE master_items MODIFY COLUMN kg_dz DECIMAL(15, 10);
-- ============================================

-- After running this, test with:
-- UPDATE master_items SET kg_dz = 1.582 WHERE id = 251;
-- SELECT kg_dz FROM master_items WHERE id = 251;
-- Should return: 1.582000 (not 1.580000)
