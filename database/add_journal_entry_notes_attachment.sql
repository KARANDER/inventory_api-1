-- ============================================
-- Add Note Fields and Attachment to Journal Entries
-- ============================================

ALTER TABLE journal_entries
ADD COLUMN IF NOT EXISTS note_1 TEXT NULL AFTER notes,
ADD COLUMN IF NOT EXISTS note_2 DECIMAL(15,2) NULL AFTER note_1,
ADD COLUMN IF NOT EXISTS note_3 TEXT NULL AFTER note_2,
ADD COLUMN IF NOT EXISTS note_4 TEXT NULL AFTER note_3,
ADD COLUMN IF NOT EXISTS attachment VARCHAR(500) NULL AFTER note_4;

-- If note_2 already exists as TEXT, modify it to DECIMAL
ALTER TABLE journal_entries
MODIFY COLUMN note_2 DECIMAL(15,2) NULL;
