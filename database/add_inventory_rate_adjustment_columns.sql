ALTER TABLE inventory_items
ADD COLUMN IF NOT EXISTS base_rate_pcs DECIMAL(12,4) NULL AFTER rate_pcs;
