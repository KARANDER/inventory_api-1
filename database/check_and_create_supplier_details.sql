-- ============================================
-- Supplier Details Table Creation
-- ============================================
-- Stores supplier-specific financial details

CREATE TABLE IF NOT EXISTS `supplier_details` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `contact_id` INT(11) NOT NULL,
  `total_amount` DECIMAL(15, 2) DEFAULT 0 COMMENT 'Total amount owed to supplier',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_contact` (`contact_id`),
  CONSTRAINT `fk_supplier_details_contact` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Note: This table mirrors customer_details structure but for suppliers
-- Run this SQL if you want to track supplier total amounts
