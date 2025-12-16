-- ============================================
-- EMPLOYEE ADVANCE PAYMENT SYSTEM
-- ============================================

-- Step 1: Create employee_advances table (Main advance records)
CREATE TABLE IF NOT EXISTS `employee_advances` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_id` INT(11) NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL COMMENT 'Original advance amount given',
  `remaining_balance` DECIMAL(15, 2) NOT NULL COMMENT 'Amount still pending repayment',
  `reason` VARCHAR(255) DEFAULT NULL COMMENT 'Reason for advance (e.g., emergency, personal)',
  `date` DATE NOT NULL COMMENT 'Date when advance was given',
  `status` ENUM('PENDING', 'PARTIAL', 'PAID') DEFAULT 'PENDING' COMMENT 'PENDING=No repayment, PARTIAL=Some repaid, PAID=Fully repaid',
  `created_by` INT(11) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_date` (`date`),
  KEY `idx_status` (`status`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 2: Create employee_advance_repayments table (Track individual repayments)
CREATE TABLE IF NOT EXISTS `employee_advance_repayments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `advance_id` INT(11) NOT NULL COMMENT 'Link to employee_advances table',
  `employee_id` INT(11) NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL COMMENT 'Amount repaid in this transaction',
  `date` DATE NOT NULL COMMENT 'Date of repayment',
  `notes` VARCHAR(255) DEFAULT NULL COMMENT 'Additional notes for repayment',
  `created_by` INT(11) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_advance_id` (`advance_id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_date` (`date`),
  FOREIGN KEY (`advance_id`) REFERENCES `employee_advances` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 3: Create indexes for better query performance
CREATE INDEX `idx_employee_status` ON `employee_advances` (`employee_id`, `status`);
CREATE INDEX `idx_advance_date` ON `employee_advances` (`employee_id`, `date`);

-- Step 4: View to get advance summary for each employee
CREATE OR REPLACE VIEW `employee_advance_summary` AS
SELECT 
  e.id as employee_id,
  e.name as employee_name,
  COUNT(DISTINCT ea.id) as total_advances,
  COALESCE(SUM(CASE WHEN ea.status = 'PENDING' THEN ea.amount ELSE 0 END), 0) as pending_amount,
  COALESCE(SUM(CASE WHEN ea.status IN ('PENDING', 'PARTIAL') THEN ea.remaining_balance ELSE 0 END), 0) as total_remaining_balance,
  COALESCE(SUM(ear.amount), 0) as total_repaid
FROM `employees` e
LEFT JOIN `employee_advances` ea ON e.id = ea.employee_id
LEFT JOIN `employee_advance_repayments` ear ON ea.id = ear.advance_id
GROUP BY e.id, e.name;

-- Step 5: Verify table creation (optional - run this to check)
-- SELECT * FROM employee_advances LIMIT 10;
-- SELECT * FROM employee_advance_repayments LIMIT 10;
-- SELECT * FROM employee_advance_summary;

-- ============================================
-- DONE! Tables are ready for employee advance payments
-- ============================================
