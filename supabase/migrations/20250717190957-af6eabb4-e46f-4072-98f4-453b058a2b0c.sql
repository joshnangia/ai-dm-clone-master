-- Disable email confirmation requirement
UPDATE auth.config 
SET email_confirm = false;

-- Set email verification to optional
ALTER TABLE auth.users 
ALTER COLUMN email_confirmed_at DROP NOT NULL;