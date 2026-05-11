-- ============================================================
-- Fix rate_pcs precision in sales_orders table
-- ============================================================
-- Problem: sales_orders.rate_pcs was DECIMAL(10,2)
--   → 42.287400 stored as 42.29 (rounded!)
-- Fix: Change to DECIMAL(15,6) to match inventory_items
-- ============================================================

ALTER TABLE sales_orders
  MODIFY COLUMN rate_pcs  DECIMAL(15, 6),
  MODIFY COLUMN scrap     DECIMAL(15, 6),
  MODIFY COLUMN labour    DECIMAL(15, 6),
  MODIFY COLUMN kg_box    DECIMAL(15, 6);

-- Verify:
-- SELECT rate_pcs, scrap, labour, kg_box FROM sales_orders LIMIT 5;
