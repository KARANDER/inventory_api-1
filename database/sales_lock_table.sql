-- ============================================
-- Sales Lock System
-- ============================================
-- This table stores the global lock status for sales operations
-- When locked, users cannot create sales orders or sales invoices

CREATE TABLE IF NOT EXISTS sales_lock (
  id INT PRIMARY KEY AUTO_INCREMENT,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  locked_by INT NULL,
  locked_at TIMESTAMP NULL,
  unlocked_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (locked_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default unlocked state
INSERT INTO sales_lock (is_locked) VALUES (FALSE);
