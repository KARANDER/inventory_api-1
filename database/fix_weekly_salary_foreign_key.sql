-- Fix: Change ON DELETE CASCADE to ON DELETE SET NULL
-- This will keep past week salary data when employee is deleted

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE employee_weekly_salary DROP FOREIGN KEY employee_weekly_salary_ibfk_1;

-- Step 2: Make employee_id nullable (required for SET NULL)
ALTER TABLE employee_weekly_salary MODIFY employee_id INT NULL;

-- Step 3: Add new foreign key with ON DELETE SET NULL
ALTER TABLE employee_weekly_salary 
ADD CONSTRAINT fk_weekly_salary_employee 
FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL;

-- Now when employee is deleted:
-- - Past week salary records will remain
-- - employee_id will be set to NULL for those records
