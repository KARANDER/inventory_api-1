-- Add changes field to user_activity table to track what was modified
ALTER TABLE `user_activity` 
ADD COLUMN `changes` JSON DEFAULT NULL COMMENT 'JSON object storing old and new values for UPDATE actions';

