-- Journal Entry Types Table (User-defined categories)
CREATE TABLE IF NOT EXISTS journal_entry_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Journal Entry Type Permissions (Which users can access which types)
CREATE TABLE IF NOT EXISTS journal_entry_type_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entry_type_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_type_id) REFERENCES journal_entry_types(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_type_user (entry_type_id, user_id),
    INDEX idx_user (user_id),
    INDEX idx_type (entry_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add entry_type_id to journal_entries table
ALTER TABLE journal_entries 
ADD COLUMN entry_type_id INT AFTER id,
ADD FOREIGN KEY (entry_type_id) REFERENCES journal_entry_types(id) ON DELETE RESTRICT,
ADD INDEX idx_entry_type (entry_type_id);
