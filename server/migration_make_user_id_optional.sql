-- Migration: Make user_id optional in orders table for guest checkout support
-- Run this in your PostgreSQL database

BEGIN;

-- Make user_id nullable
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Drop the foreign key constraint if it prevents NULL
-- ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Re-create the foreign key constraint with proper NULL handling
-- ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey 
--   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;

COMMIT;
