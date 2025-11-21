/**
 * Products Service
 * Business logic for products
 * @module modules/products/service
 */

import prisma from '../../common/config/database.js';
import { slugify } from '../../common/utils/slugify.js';

class ProductsService {
  /**
   * Get all products with pagination and filters
   */
  async getAll({ page = 1, limit = 10, category, search, sort = 'created_at' }) {
    const skip = (page - 1) * limit;
    
    const where = {
      is_active: true,
      is_deleted: false,
      ...(category && { category_id: category }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          images: {
            orderBy: { sort_order: 'asc' },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: { [sort]: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating
    const productsWithRating = products.map(product => ({
      ...product,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0,
      reviewCount: product.reviews.length,
    }));

    return { products: productsWithRating, total };
  }

  /**
   * Get product by ID
   */
  async getById(id) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { sort_order: 'asc' },
        },
        variants: {
          where: { is_active: true },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
          where: { is_approved: true },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!product || product.is_deleted) {
      throw new Error('Product not found');
    }

    // Increment view count
    await prisma.product.update({
      where: { id },
      data: { view_count: { increment: 1 } },
    });

    return product;
  }

  /**
   * Create new product
   */
  async create(productData) {
    const { name, images, variants, ...data } = productData;
    
    // Generate unique slug
    let baseSlug = slugify(name);
    let slug = baseSlug;
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        name,
        slug,
        images: images ? {
          create: images.map((img, index) => ({
            url: img.url,
            alt_text: img.alt_text,
            sort_order: index,
            is_primary: index === 0,
          })),
        } : undefined,
        variants: variants ? {
          create: variants,
        } : undefined,
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return product;
  }

  /**
   * Update product
   */
  async update(id, productData) {
    const product = await prisma.product.findUnique({ where: { id } });
    
    if (!product || product.is_deleted) {
      throw new Error('Product not found');
    }

    const { images, variants, ...data } = productData;

    // Handle image updates if provided
    const updateData = { ...data };
    
    if (images && images.length > 0) {
      // Delete existing images and create new ones
      updateData.images = {
        deleteMany: {},
        create: images.map((img, index) => ({
          url: img.url,
          alt_text: img.alt_text,
          sort_order: img.sort_order !== undefined ? img.sort_order : index,
          is_primary: img.is_primary !== undefined ? img.is_primary : index === 0,
        })),
      };
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        variants: true,
      },
    });

    return updated;
  }

  /**
   * Delete product (soft delete)
   */
  async delete(id) {
    const product = await prisma.product.findUnique({ where: { id } });
    
    if (!product || product.is_deleted) {
      throw new Error('Product not found');
    }

    await prisma.product.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });
  }

  /**
   * Get featured products
   */
  async getFeatured() {
    return await prisma.product.findMany({
      where: {
        is_featured: true,
        is_active: true,
        is_deleted: false,
      },
      include: {
        images: {
          orderBy: { sort_order: 'asc' },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 8,
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Get first collection products
   */
  async getFirstCollection() {
    return await prisma.product.findMany({
      where: {
        is_first_collection: true,
        is_active: true,
        is_deleted: false,
      },
      include: {
        images: {
          orderBy: { sort_order: 'asc' },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 8,
      orderBy: { created_at: 'desc' },
    });
  }
}

export default new ProductsService();
