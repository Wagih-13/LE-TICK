#!/bin/bash

# Delivery Fee Migration Script
# This script adds the delivery_fee column to products and order_items tables

echo "🚀 Running Delivery Fee Migration..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "Please set it in your .env file or export it:"
    echo "export DATABASE_URL='your_database_url'"
    exit 1
fi

# Load .env file if it exists
if [ -f .env ]; then
    echo "📄 Loading environment variables from .env..."
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "📊 Database: $DATABASE_URL"
echo ""

# Run the migration SQL
echo "🔧 Adding delivery_fee columns..."
psql "$DATABASE_URL" << 'EOF'
-- Add delivery_fee column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- Add delivery_fee column to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN products.delivery_fee IS 'Delivery fee for this product';
COMMENT ON COLUMN order_items.delivery_fee IS 'Delivery fee at time of purchase';

-- Verify columns were added
SELECT 
    'products' as table_name,
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'delivery_fee'
UNION ALL
SELECT 
    'order_items' as table_name,
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'order_items' AND column_name = 'delivery_fee';
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Regenerate Prisma client: npx prisma generate"
    echo "2. Restart your backend server"
    echo "3. Test adding/editing products with delivery fees"
else
    echo ""
    echo "❌ Migration failed!"
    echo "Please check the error messages above."
    exit 1
fi
