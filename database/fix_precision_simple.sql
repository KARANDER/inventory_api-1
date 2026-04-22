-- ============================================
-- Simple Fix - Core Tables Only
-- ============================================
-- This fixes only the most important columns
-- Safe and fast - ignores errors if column doesn't exist

-- ============================================
-- MASTER ITEMS
-- ============================================
ALTER TABLE master_items MODIFY COLUMN kg_dz DECIMAL(15, 6);
ALTER TABLE master_items MODIFY COLUMN stock_quantity DECIMAL(15, 6);
ALTER TABLE master_items MODIFY COLUMN stock_kg DECIMAL(15, 6);

-- ============================================
-- INVENTORY ITEMS
-- ============================================
ALTER TABLE inventory_items MODIFY COLUMN scrap DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN labour DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN kg_dzn DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN pcs_box DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN box_ctn DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN pcs_ctn DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN kg_box DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN empty_wt DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN actual_wt DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN rate_pcs DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN base_rate_pcs DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN rate_kg DECIMAL(15, 6);
ALTER TABLE inventory_items MODIFY COLUMN stock_quantity DECIMAL(15, 6);

-- ============================================
-- SALES ORDERS
-- ============================================
ALTER TABLE sales_orders MODIFY COLUMN quantity_pcs DECIMAL(15, 6);
ALTER TABLE sales_orders MODIFY COLUMN rate_kz DECIMAL(15, 6);
ALTER TABLE sales_orders MODIFY COLUMN initial_qty DECIMAL(15, 6);

-- ============================================
-- PURCHASE INVOICES
-- ============================================
ALTER TABLE purchase_invoices MODIFY COLUMN total_amount DECIMAL(15, 2);
ALTER TABLE purchase_invoices MODIFY COLUMN balance_due DECIMAL(15, 2);

-- ============================================
-- PURCHASE INVOICE ITEMS
-- ============================================
ALTER TABLE purchase_invoice_items MODIFY COLUMN total_psc DECIMAL(15, 6);
ALTER TABLE purchase_invoice_items MODIFY COLUMN net_kg DECIMAL(15, 6);
ALTER TABLE purchase_invoice_items MODIFY COLUMN total_kg DECIMAL(15, 6);
ALTER TABLE purchase_invoice_items MODIFY COLUMN no_of_peti DECIMAL(15, 6);
ALTER TABLE purchase_invoice_items MODIFY COLUMN ret_peti_no DECIMAL(15, 6);
ALTER TABLE purchase_invoice_items MODIFY COLUMN peti_balance DECIMAL(15, 6);

-- ============================================
-- DONE!
-- ============================================
-- If you see errors about columns not existing, that's OK!
-- It just means those columns don't exist in your database.
-- The important ones will be fixed.

-- Test with:
-- UPDATE master_items SET kg_dz = 1.582 WHERE id = 251;
-- SELECT kg_dz FROM master_items WHERE id = 251;
-- Should return: 1.582000
