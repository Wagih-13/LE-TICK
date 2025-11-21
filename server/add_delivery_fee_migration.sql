-- Migration: Add delivery_fee to products and order_items tables
-- Run this SQL migration manually or use: npx prisma migrate dev --name add_delivery_fee

-- Add delivery_fee column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- Add delivery_fee column to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN products.delivery_fee IS 'Delivery fee for this product';
COMMENT ON COLUMN order_items.delivery_fee IS 'Delivery fee at time of purchase';
