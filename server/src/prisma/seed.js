/**
 * Database Seeder
 * Populates database with sample data
 */

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../common/utils/password.js';
import { slugify } from '../common/utils/slugify.js';
import config from '../common/config/env.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword(config.adminPassword);
  const admin = await prisma.user.upsert({
    where: { email: config.adminEmail },
    update: {},
    create: {
      email: config.adminEmail,
      password_hash: adminPassword,
      first_name: config.adminFirstName,
      last_name: config.adminLastName,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = [
    { name: 'Luxury Watches', description: 'Premium luxury timepieces' },
    { name: 'Sport Watches', description: 'Watches for active lifestyle' },
    { name: 'Smart Watches', description: 'Modern smartwatches' },
    { name: 'Classic Watches', description: 'Timeless classic designs' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(cat.name) },
      update: {},
      create: {
        name: cat.name,
        slug: slugify(cat.name),
        description: cat.description,
        is_active: true,
      },
    });
  }
  console.log('✅ Categories created');

  // Create sample products
  const luxuryCategory = await prisma.category.findUnique({
    where: { slug: 'luxury-watches' },
  });

  const products = [
    {
      name: 'Rolex Submariner',
      sku: 'ROL-SUB-001',
      price: 8500,
      stock_quantity: 5,
      description: 'Iconic diving watch with exceptional craftsmanship',
      category_id: luxuryCategory.id,
    },
    {
      name: 'Omega Seamaster',
      sku: 'OMG-SEA-001',
      price: 6200,
      stock_quantity: 8,
      description: 'Professional diving watch with Co-Axial movement',
      category_id: luxuryCategory.id,
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {},
      create: {
        ...prod,
        slug: slugify(prod.name),
        is_featured: true,
        is_active: true,
      },
    });
  }
  console.log('✅ Products created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
