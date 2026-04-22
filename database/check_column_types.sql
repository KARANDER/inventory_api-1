-- ============================================
-- Check Current Column Data Types
-- ============================================
-- Run this to see what precision your columns currently have

-- Check master_items columns
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_TYPE,
    NUMERIC_PRECISION,
    NUMERIC_SCALE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'master_items'
  AND COLUMN_NAME IN ('kg_dz', 'stock_quantity', 'stock_kg')
ORDER BY COLUMN_NAME;

-- Check inventory_items columns
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_TYPE,
    NUMERIC_PRECISION,
    NUMERIC_SCALE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'inventory_items'
  AND COLUMN_NAME IN ('scrap', 'labour', 'kg_dzn', 'rate_pcs', 'stock_quantity')
ORDER BY COLUMN_NAME;

-- ============================================
-- What to look for:
-- ============================================
-- If NUMERIC_SCALE = 2, that's the problem!
-- Example: DECIMAL(10,2) only stores 2 decimal places
-- 
-- You need: DECIMAL(15,6) or higher
-- This gives you 6 decimal places
-- ============================================
