-- ============================================
-- Sales Lock System
-- ============================================
-- This table stores the global lock status for sales operations
-- Users can lock specific modules/pages

-- Drop old table if exists
DROP TABLE IF EXISTS sales_lock;

-- Create new table with module support
CREATE TABLE sales_lock (
  id INT PRIMARY KEY AUTO_INCREMENT,
  module_name VARCHAR(100) NOT NULL UNIQUE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  locked_by INT NULL,
  locked_at TIMESTAMP NULL,
  unlocked_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (locked_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default modules (all unlocked)
INSERT INTO sales_lock (module_name, is_locked) VALUES 
  ('all', FALSE),
  ('master_items', FALSE),
  ('inventory_items', FALSE),
  ('sales_orders', FALSE),
  ('sales_invoices', FALSE),
  ('purchase_invoices', FALSE),
  ('customers', FALSE),
  ('suppliers', FALSE),
  ('contacts', FALSE),
  ('payments', FALSE),
  ('receipts', FALSE),
  ('accounts', FALSE);
