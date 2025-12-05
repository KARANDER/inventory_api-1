-- ============================================
-- Add employee_management permission to users
-- ============================================
-- Run this SQL to add the employee_management permission

-- Option 1: Add permission to a specific user by user_id
-- Replace USER_ID with the actual user ID
INSERT INTO user_permissions (user_id, permission_name) 
VALUES (USER_ID, 'employee_management')
ON DUPLICATE KEY UPDATE permission_name = permission_name;

-- Option 2: Add permission to a specific user by email
-- Replace 'user@example.com' with the actual email
INSERT INTO user_permissions (user_id, permission_name)
SELECT id, 'employee_management'
FROM users
WHERE email = 'user@example.com'
ON DUPLICATE KEY UPDATE permission_name = permission_name;

-- Option 3: Add permission to ALL existing users
INSERT INTO user_permissions (user_id, permission_name)
SELECT id, 'employee_management'
FROM users
ON DUPLICATE KEY UPDATE permission_name = permission_name;

-- Verify the permission was added
SELECT u.id, u.user_name, u.email, up.permission_name
FROM users u
LEFT JOIN user_permissions up ON u.id = up.user_id
WHERE up.permission_name = 'employee_management';

