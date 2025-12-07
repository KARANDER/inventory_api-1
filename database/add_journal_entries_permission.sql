-- Add journal_entries permission to a specific user (replace USER_ID with your user ID)
INSERT INTO user_permissions (user_id, permission_name) 
VALUES (1, 'journal_entries')
ON DUPLICATE KEY UPDATE permission_name = permission_name;

-- OR add to user by email (replace with your email)
INSERT INTO user_permissions (user_id, permission_name)
SELECT id, 'journal_entries'
FROM users
WHERE email = 'your-email@example.com'
ON DUPLICATE KEY UPDATE permission_name = permission_name;


