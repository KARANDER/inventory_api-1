-- Add employee_name column to keep record of who the salary was for
-- Even after employee is deleted, you can see the name

ALTER TABLE employee_weekly_salary 
ADD COLUMN employee_name VARCHAR(255) NULL AFTER employee_id;

-- Update existing records with employee names
UPDATE employee_weekly_salary ews
JOIN employees e ON ews.employee_id = e.id
SET ews.employee_name = e.name;
