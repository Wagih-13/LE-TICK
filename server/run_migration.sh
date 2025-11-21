#!/bin/bash

# Migration Script to make user_id optional in orders table
# This allows guest checkout without user registration

echo "🚀 Running migration to enable guest checkout..."
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL (psql) is not installed or not in PATH"
    echo "Please install PostgreSQL first"
    exit 1
fi

# Get database credentials from .env
if [ -f .env ]; then
    echo "✅ Found .env file"
    export $(grep -v '^#' .env | xargs)
else
    echo "❌ .env file not found"
    echo "Please create .env file with DATABASE_URL"
    exit 1
fi

# Extract database connection info from DATABASE_URL
# Format: postgresql://user:password@host:port/database
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in .env"
    exit 1
fi

echo "📦 Database URL found"
echo ""

# Run the migration SQL
echo "🔄 Making user_id optional in orders table..."
psql "$DATABASE_URL" << EOF
-- Make user_id nullable for guest checkout
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Verify the change
\d orders
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "🔄 Regenerating Prisma client..."
    npx prisma generate
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Prisma client regenerated!"
        echo ""
        echo "🎉 All done! You can now:"
        echo "   1. Restart your server: npm run dev"
        echo "   2. Test guest checkout (no login required)"
        echo ""
    else
        echo "❌ Failed to regenerate Prisma client"
        exit 1
    fi
else
    echo ""
    echo "❌ Migration failed"
    echo "Please check your database connection and try again"
    exit 1
fi
