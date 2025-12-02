-- ============================================
-- Stock History Table Creation
-- ============================================
-- Tracks stock movements (PCS & KG) for each item

CREATE TABLE IF NOT EXISTS `stock_history` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `item_code` VARCHAR(191) NOT NULL,
  `transaction_type` ENUM('CREDIT', 'DEBIT') NOT NULL COMMENT 'CREDIT = Stock In, DEBIT = Stock Out',
  `invoice_type` ENUM('PURCHASE', 'SALES') NOT NULL,
  `invoice_number` VARCHAR(191) DEFAULT NULL,
  `quantity_pcs` DECIMAL(15,3) NOT NULL DEFAULT 0,
  `quantity_kg` DECIMAL(15,3) NOT NULL DEFAULT 0,
  `movement_date` DATE NOT NULL,
  `note` TEXT DEFAULT NULL,
  `user_id` INT(11) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_item_code` (`item_code`),
  KEY `idx_movement_date` (`movement_date`),
  KEY `idx_invoice_number` (`invoice_number`),
  KEY `idx_transaction_type` (`transaction_type`),
  KEY `idx_invoice_type` (`invoice_type`),
  CONSTRAINT `fk_stock_history_item` FOREIGN KEY (`item_code`) REFERENCES `master_items` (`item_code`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

