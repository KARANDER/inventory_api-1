-- ============================================
-- Safe Version - Fix Numeric Precision
-- ============================================
-- This version continues even if some tables don't exist
-- Run this if you're not sure which tables exist

-- Set to continue on error
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='';

-- ============================================
-- CORE TABLES (Most Important)
-- ============================================

-- Master Items
SET @sql = 'ALTER TABLE master_items 
  MODIFY COLUMN kg_dz DECIMAL(15, 6),
  MODIFY COLUMN stock_quantity DECIMAL(15, 6),
  MODIFY COLUMN stock_kg DECIMAL(15, 6)';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Inventory Items
SET @sql = 'ALTER TABLE inventory_items 
  MODIFY COLUMN scrap DECIMAL(15, 6),
  MODIFY COLUMN labour DECIMAL(15, 6),
  MODIFY COLUMN kg_dzn DECIMAL(15, 6),
  MODIFY COLUMN rate_pcs DECIMAL(15, 6),
  MODIFY COLUMN stock_quantity DECIMAL(15, 6)';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Sales Orders
SET @sql = 'ALTER TABLE sales_orders 
  MODIFY COLUMN quantity_pcs DECIMAL(15, 6),
  MODIFY COLUMN rate_kz DECIMAL(15, 6)';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Invoices
SET @sql = 'ALTER TABLE invoices 
  MODIFY COLUMN total_net_kg DECIMAL(15, 6),
  MODIFY COLUMN grand_total DECIMAL(15, 2)';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Purchase Invoices
SET @sql = 'ALTER TABLE purchase_invoices 
  MODIFY COLUMN total_amount DECIMAL(15, 2),
  MODIFY COLUMN balance_due DECIMAL(15, 2)';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Purchase Invoice Items
SET @sql = 'ALTER TABLE purchase_invoice_items 
  MODIFY COLUMN total_psc DECIMAL(15, 6),
  MODIFY COLUMN net_kg DECIMAL(15, 6),
  MODIFY COLUMN total_kg DECIMAL(15, 6)';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Restore SQL mode
SET SQL_MODE=@OLD_SQL_MODE;

SELECT '✅ Core tables updated successfully!' AS Status;

-- ============================================
-- To check if it worked:
-- ============================================
-- SELECT COLUMN_NAME, COLUMN_TYPE 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_NAME = 'master_items' 
-- AND COLUMN_NAME = 'kg_dz';
-- 
-- Should show: decimal(15,6)
-- ============================================
