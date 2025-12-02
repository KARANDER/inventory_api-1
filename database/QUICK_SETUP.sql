-- ============================================
-- QUICK SETUP: Account History Table
-- ============================================
-- Copy and paste this entire file into phpMyAdmin SQL tab
-- Make sure you're in the 'inventory' database

-- Step 1: Create the account_history table
CREATE TABLE IF NOT EXISTS `account_history` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `account_id` INT(11) NOT NULL,
  `transaction_type` ENUM('CREDIT', 'DEBIT') NOT NULL COMMENT 'CREDIT = Receipt (money added), DEBIT = Payment (money subtracted)',
  `amount` DECIMAL(15, 2) NOT NULL,
  `contact_id` INT(11) DEFAULT NULL COMMENT 'ID from contacts table (customer or supplier)',
  `contact_name` VARCHAR(255) DEFAULT NULL COMMENT 'Name of customer/supplier for easy display',
  `contact_type` VARCHAR(50) DEFAULT NULL COMMENT 'Customer or Supplier',
  `date` DATE NOT NULL,
  `description` TEXT DEFAULT NULL,
  `reference` VARCHAR(255) DEFAULT NULL,
  `receipt_id` INT(11) DEFAULT NULL COMMENT 'Link to receipts table if transaction is from receipt',
  `payment_id` INT(11) DEFAULT NULL COMMENT 'Link to payments table if transaction is from payment',
  `balance_after` DECIMAL(15, 2) DEFAULT NULL COMMENT 'Account balance after this transaction',
  `user_id` INT(11) DEFAULT NULL COMMENT 'User who created the transaction',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_account_id` (`account_id`),
  KEY `idx_contact_id` (`contact_id`),
  KEY `idx_date` (`date`),
  KEY `idx_transaction_type` (`transaction_type`),
  KEY `idx_receipt_id` (`receipt_id`),
  KEY `idx_payment_id` (`payment_id`),
  CONSTRAINT `fk_account_history_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_account_history_contact` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_account_history_receipt` FOREIGN KEY (`receipt_id`) REFERENCES `receipts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_account_history_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 2: Create performance indexes
CREATE INDEX `idx_account_date` ON `account_history` (`account_id`, `date`);
CREATE INDEX `idx_account_type` ON `account_history` (`account_id`, `transaction_type`);

-- Step 3: Verify table creation (optional - run this to check)
-- SELECT * FROM account_history LIMIT 10;

-- ============================================
-- DONE! The table is now ready.
-- ============================================
-- The system will automatically create history records when:
-- 1. Receipts are created (CREDIT entries)
-- 2. Payments are created (DEBIT entries)
-- 3. Receipts/Payments are deleted (history is also deleted)

