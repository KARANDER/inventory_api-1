-- ============================================
-- Smart Fix - Only Updates Columns That Exist
-- ============================================
-- This version checks if each column exists before modifying it
-- Safe to run on any database

DELIMITER $$

-- ============================================
-- 1. MASTER ITEMS TABLE
-- ============================================
DROP PROCEDURE IF EXISTS fix_master_items$$
CREATE PROCEDURE fix_master_items()
BEGIN
    -- kg_dz
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'master_items' 
               AND COLUMN_NAME = 'kg_dz') THEN
        ALTER TABLE master_items MODIFY COLUMN kg_dz DECIMAL(15, 6);
        SELECT '✅ Fixed master_items.kg_dz' AS Status;
    END IF;
    
    -- stock_quantity
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'master_items' 
               AND COLUMN_NAME = 'stock_quantity') THEN
        ALTER TABLE master_items MODIFY COLUMN stock_quantity DECIMAL(15, 6);
        SELECT '✅ Fixed master_items.stock_quantity' AS Status;
    END IF;
    
    -- stock_kg
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'master_items' 
               AND COLUMN_NAME = 'stock_kg') THEN
        ALTER TABLE master_items MODIFY COLUMN stock_kg DECIMAL(15, 6);
        SELECT '✅ Fixed master_items.stock_kg' AS Status;
    END IF;
END$$

-- ============================================
-- 2. INVENTORY ITEMS TABLE
-- ============================================
DROP PROCEDURE IF EXISTS fix_inventory_items$$
CREATE PROCEDURE fix_inventory_items()
BEGIN
    DECLARE col_name VARCHAR(64);
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR 
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'inventory_items' 
        AND COLUMN_NAME IN ('scrap', 'labour', 'kg_dzn', 'pcs_box', 'box_ctn', 
                            'pcs_ctn', 'kg_box', 'empty_wt', 'actual_wt', 
                            'rate_pcs', 'base_rate_pcs', 'rate_kg', 'stock_quantity');
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO col_name;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        SET @sql = CONCAT('ALTER TABLE inventory_items MODIFY COLUMN ', col_name, ' DECIMAL(15, 6)');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        
        SELECT CONCAT('✅ Fixed inventory_items.', col_name) AS Status;
    END LOOP;
    CLOSE cur;
END$$

-- ============================================
-- 3. SALES ORDERS TABLE
-- ============================================
DROP PROCEDURE IF EXISTS fix_sales_orders$$
CREATE PROCEDURE fix_sales_orders()
BEGIN
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'sales_orders' 
               AND COLUMN_NAME = 'quantity_pcs') THEN
        ALTER TABLE sales_orders MODIFY COLUMN quantity_pcs DECIMAL(15, 6);
        SELECT '✅ Fixed sales_orders.quantity_pcs' AS Status;
    END IF;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'sales_orders' 
               AND COLUMN_NAME = 'rate_kz') THEN
        ALTER TABLE sales_orders MODIFY COLUMN rate_kz DECIMAL(15, 6);
        SELECT '✅ Fixed sales_orders.rate_kz' AS Status;
    END IF;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'sales_orders' 
               AND COLUMN_NAME = 'initial_qty') THEN
        ALTER TABLE sales_orders MODIFY COLUMN initial_qty DECIMAL(15, 6);
        SELECT '✅ Fixed sales_orders.initial_qty' AS Status;
    END IF;
END$$

-- ============================================
-- 4. INVOICES TABLE
-- ============================================
DROP PROCEDURE IF EXISTS fix_invoices$$
CREATE PROCEDURE fix_invoices()
BEGIN
    DECLARE col_name VARCHAR(64);
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR 
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'invoices' 
        AND COLUMN_NAME IN ('total_net_kg', 'grand_total', 'reference_no_1', 
                            'reference_no_2', 'remaining_amount');
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO col_name;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Use DECIMAL(15,6) for weights, DECIMAL(15,2) for money
        IF col_name IN ('grand_total', 'remaining_amount') THEN
            SET @sql = CONCAT('ALTER TABLE invoices MODIFY COLUMN ', col_name, ' DECIMAL(15, 2)');
        ELSE
            SET @sql = CONCAT('ALTER TABLE invoices MODIFY COLUMN ', col_name, ' DECIMAL(15, 6)');
        END IF;
        
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        
        SELECT CONCAT('✅ Fixed invoices.', col_name) AS Status;
    END LOOP;
    CLOSE cur;
END$$

-- ============================================
-- 5. PURCHASE INVOICES TABLE
-- ============================================
DROP PROCEDURE IF EXISTS fix_purchase_invoices$$
CREATE PROCEDURE fix_purchase_invoices()
BEGIN
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'purchase_invoices' 
               AND COLUMN_NAME = 'total_amount') THEN
        ALTER TABLE purchase_invoices MODIFY COLUMN total_amount DECIMAL(15, 2);
        SELECT '✅ Fixed purchase_invoices.total_amount' AS Status;
    END IF;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'purchase_invoices' 
               AND COLUMN_NAME = 'balance_due') THEN
        ALTER TABLE purchase_invoices MODIFY COLUMN balance_due DECIMAL(15, 2);
        SELECT '✅ Fixed purchase_invoices.balance_due' AS Status;
    END IF;
END$$

-- ============================================
-- 6. PURCHASE INVOICE ITEMS TABLE
-- ============================================
DROP PROCEDURE IF EXISTS fix_purchase_invoice_items$$
CREATE PROCEDURE fix_purchase_invoice_items()
BEGIN
    DECLARE col_name VARCHAR(64);
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR 
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'purchase_invoice_items' 
        AND COLUMN_NAME IN ('total_psc', 'net_kg', 'total_kg', 'no_of_peti', 
                            'ret_peti_no', 'peti_balance', 'amount');
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO col_name;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Use DECIMAL(15,2) for amount, DECIMAL(15,6) for others
        IF col_name = 'amount' THEN
            SET @sql = CONCAT('ALTER TABLE purchase_invoice_items MODIFY COLUMN ', col_name, ' DECIMAL(15, 2)');
        ELSE
            SET @sql = CONCAT('ALTER TABLE purchase_invoice_items MODIFY COLUMN ', col_name, ' DECIMAL(15, 6)');
        END IF;
        
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        
        SELECT CONCAT('✅ Fixed purchase_invoice_items.', col_name) AS Status;
    END LOOP;
    CLOSE cur;
END$$

DELIMITER ;

-- ============================================
-- RUN ALL PROCEDURES
-- ============================================
SELECT '🚀 Starting precision fix...' AS Status;

CALL fix_master_items();
CALL fix_inventory_items();
CALL fix_sales_orders();
CALL fix_invoices();
CALL fix_purchase_invoices();
CALL fix_purchase_invoice_items();

-- Clean up procedures
DROP PROCEDURE IF EXISTS fix_master_items;
DROP PROCEDURE IF EXISTS fix_inventory_items;
DROP PROCEDURE IF EXISTS fix_sales_orders;
DROP PROCEDURE IF EXISTS fix_invoices;
DROP PROCEDURE IF EXISTS fix_purchase_invoices;
DROP PROCEDURE IF EXISTS fix_purchase_invoice_items;

SELECT '✅ All precision fixes completed!' AS Status;

-- ============================================
-- VERIFY
-- ============================================
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('master_items', 'inventory_items', 'sales_orders', 
                      'invoices', 'purchase_invoices', 'purchase_invoice_items')
  AND DATA_TYPE IN ('decimal', 'float', 'double')
ORDER BY TABLE_NAME, COLUMN_NAME;
