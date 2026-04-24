-- ============================================
-- Sales Lock System
-- ============================================
-- IMPORTANT: Select your database first in phpMyAdmin before running this!
-- Or uncomment and edit the line below:
-- USE your_database_name;

-- This table stores the global lock status for sales operations
-- Users can lock specific modules/pages

-- Drop old table if exists
DROP TABLE IF EXISTS sales_lock;

-- Create new table with module support
CREATE TABLE sales_lock (
  id INT PRIMARY KEY AUTO_INCREMENT,
  module_name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  locked_by INT NULL,
  locked_at TIMESTAMP NULL,
  unlocked_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (locked_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default modules (all unlocked) with display names
INSERT INTO sales_lock (module_name, display_name, is_locked) VALUES 
  ('all', 'All Pages', FALSE),
  ('dashboard', 'Dashboard', FALSE),
  ('accounts', 'Bank and Cash Accounts', FALSE),
  ('receipts', 'Receipts', FALSE),
  ('payments', 'Payments', FALSE),
  ('customers', 'Customers', FALSE),
  ('suppliers', 'Suppliers', FALSE),
  ('sales_orders', 'Sales Orders', FALSE),
  ('sales_invoices', 'Sales Invoices', FALSE),
  ('purchase_invoices', 'Purchase Invoices', FALSE),
  ('inventory_items', 'Inventory Items', FALSE),
  ('master_items', 'Master Product', FALSE),
  ('employees', 'Employees', FALSE),
  ('journal_entries', 'Journal Entries', FALSE);
