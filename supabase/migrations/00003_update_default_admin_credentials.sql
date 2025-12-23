/*
# Update Default Admin Credentials

This migration ensures the correct default admin user exists with the proper credentials.

## Changes
1. Delete any existing admin user with old credentials
2. Insert the correct default admin user if no admin exists

## Default Admin Credentials
- Username: Riya A
- Password: Radha@108
- Role: admin
*/

-- Delete old admin user if exists (with old credentials)
DELETE FROM users WHERE username = 'admin' AND password = 'admin123';

-- Insert correct default admin if no admin user exists
INSERT INTO users (username, password, role, assigned_competitions)
SELECT 
  'Riya A',
  'Radha@108',
  'admin'::user_role,
  ARRAY[]::text[]
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE role = 'admin'::user_role
);
