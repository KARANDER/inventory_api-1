-- ============================================================
-- Fix empty_wt and actual_wt precision in inventory_items
-- ============================================================
-- Problem: Columns were DECIMAL(10,2), so 4.051 was rounded to 4.05
-- Solution: Change to DECIMAL(15,6) to allow up to 6 decimal places
-- ============================================================

ALTER TABLE inventory_items
  MODIFY COLUMN empty_wt  DECIMAL(15, 6),
  MODIFY COLUMN actual_wt DECIMAL(15, 6);

-- Verify:
-- SELECT empty_wt, actual_wt FROM inventory_items LIMIT 5;
