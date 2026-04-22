-- ============================================
-- Check ALL Numeric Columns in Database
-- ============================================
-- This query finds ALL numeric columns that might have precision issues
-- Run this first to see what needs to be fixed

SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    COLUMN_TYPE,
    DATA_TYPE,
    NUMERIC_PRECISION,
    NUMERIC_SCALE,
    CASE 
        WHEN DATA_TYPE = 'float' THEN '⚠️ FLOAT - Loses precision, should be DECIMAL'
        WHEN DATA_TYPE = 'double' THEN '⚠️ DOUBLE - Can lose precision, consider DECIMAL'
        WHEN DATA_TYPE = 'decimal' AND NUMERIC_SCALE < 3 THEN '⚠️ Only 2 decimals - Should be at least DECIMAL(15,6)'
        WHEN DATA_TYPE = 'decimal' AND NUMERIC_SCALE >= 6 THEN '✅ Good precision'
        ELSE '⚠️ Check this column'
    END AS STATUS,
    CONCAT('ALTER TABLE ', TABLE_NAME, ' MODIFY COLUMN ', COLUMN_NAME, ' DECIMAL(15, 6);') AS FIX_QUERY
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND DATA_TYPE IN ('decimal', 'float', 'double', 'numeric')
  AND TABLE_NAME NOT LIKE '%_backup%'
  -- Exclude system tables
  AND TABLE_NAME NOT IN (
    'INNODB_BUFFER_POOL_STATS', 'INNODB_METRICS', 'CLIENT_STATISTICS',
    'THREAD_STATISTICS', 'USER_STATISTICS', 'PROFILING', 'ST_UNITS_OF_MEASURE'
  )
  AND TABLE_NAME NOT LIKE 'INNODB_%'
  AND TABLE_NAME NOT LIKE '%_STATISTICS'
  -- Only show your application tables
  AND TABLE_NAME IN (
    'master_items', 'inventory_items', 'sales_orders', 'invoices', 
    'invoice_items', 'purchase_invoices', 'purchase_invoice_items',
    'stock_history', 'contacts', 'customer_details', 'supplier_details',
    'receipts', 'payments', 'accounts', 'account_history',
    'carton_inventory', 'shipping_cartons', 'sales_invoices',
    'employee_weekly_salary', 'employee_advance', 'journal_entries'
  )
ORDER BY 
    CASE 
        WHEN DATA_TYPE = 'float' THEN 1
        WHEN DATA_TYPE = 'double' THEN 2
        WHEN NUMERIC_SCALE < 3 THEN 3
        ELSE 4
    END,
    TABLE_NAME, 
    COLUMN_NAME;

-- ============================================
-- How to use this:
-- ============================================
-- 1. Run this query
-- 2. Look at the STATUS column
-- 3. Copy the FIX_QUERY for columns that need fixing
-- 4. Run those ALTER TABLE statements
-- ============================================
