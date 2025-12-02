-- ============================================
-- User Activity (System History) Table
-- ============================================
-- Tracks create/update/delete actions across the system

CREATE TABLE IF NOT EXISTS `user_activity` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `user_name` VARCHAR(191) NOT NULL,
  `model_name` VARCHAR(191) NOT NULL COMMENT 'Page / model name (e.g., accounts, inventory_items)',
  `action_type` ENUM('CREATE','UPDATE','DELETE','LOGIN','LOGOUT') NOT NULL,
  `record_id` INT(11) DEFAULT NULL COMMENT 'Affected record primary key (if available)',
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_model_name` (`model_name`),
  KEY `idx_action_type` (`action_type`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_user_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

