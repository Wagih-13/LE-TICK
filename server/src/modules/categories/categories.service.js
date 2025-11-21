import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class CategoriesService {
  /**
   * Get all categories with pagination and filters
   */
  async getAll({ page = 1, limit = 10, search, parent_id, is_active }) {
    const skip = (page - 1) * limit;
    
    const where = {
      is_deleted: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(parent_id !== undefined && { parent_id: parent_id === 'null' ? null : parent_id }),
      ...(is_active !== undefined && { is_active: is_active === 'true' }),
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          children: {
            where: { is_deleted: false },
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              products: {
                where: { is_deleted: false },
              },
            },
          },
        },
        orderBy: [
          { sort_order: 'asc' },
          { name: 'asc' },
        ],
      }),
      prisma.category.count({ where }),
    ]);

    return {
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get category by ID
   */
  async getById(id) {
    const category = await prisma.category.findFirst({
      where: {
        id,
        is_deleted: false,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          where: { is_deleted: false },
        },
        _count: {
          select: {
            products: {
              where: { is_deleted: false },
            },
          },
        },
      },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  /**
   * Get category by slug
   */
  async getBySlug(slug) {
    const category = await prisma.category.findFirst({
      where: {
        slug,
        is_deleted: false,
      },
      include: {
        parent: true,
        children: {
          where: { is_deleted: false },
        },
        products: {
          where: {
            is_active: true,
            is_deleted: false,
          },
          take: 20,
        },
      },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  /**
   * Create new category
   */
  async create(data) {
    const { name, description, image_url, parent_id, sort_order, is_active } = data;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    // Verify parent exists if provided
    if (parent_id) {
      const parentCategory = await prisma.category.findFirst({
        where: {
          id: parent_id,
          is_deleted: false,
        },
      });

      if (!parentCategory) {
        throw new Error('Parent category not found');
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image_url,
        parent_id: parent_id || null,
        sort_order: sort_order || 0,
        is_active: is_active !== undefined ? is_active : true,
      },
      include: {
        parent: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return category;
  }

  /**
   * Update category
   */
  async update(id, data) {
    const { name, description, image_url, parent_id, sort_order, is_active } = data;

    // Check if category exists
    const existingCategory = await this.getById(id);

    // Generate new slug if name changed
    let slug = existingCategory.slug;
    if (name && name !== existingCategory.name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug already exists
      const slugExists = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (slugExists) {
        throw new Error('Category with this name already exists');
      }
    }

    // Prevent category from being its own parent
    if (parent_id === id) {
      throw new Error('Category cannot be its own parent');
    }

    // Verify parent exists if provided
    if (parent_id) {
      const parentCategory = await prisma.category.findFirst({
        where: {
          id: parent_id,
          is_deleted: false,
        },
      });

      if (!parentCategory) {
        throw new Error('Parent category not found');
      }

      // Check for circular reference
      const isCircular = await this.checkCircularReference(id, parent_id);
      if (isCircular) {
        throw new Error('Circular reference detected in category hierarchy');
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name, slug }),
        ...(description !== undefined && { description }),
        ...(image_url !== undefined && { image_url }),
        ...(parent_id !== undefined && { parent_id: parent_id || null }),
        ...(sort_order !== undefined && { sort_order }),
        ...(is_active !== undefined && { is_active }),
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return category;
  }

  /**
   * Delete category (soft delete)
   */
  async delete(id) {
    // Check if category exists
    await this.getById(id);

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: {
        category_id: id,
        is_deleted: false,
      },
    });

    if (productsCount > 0) {
      throw new Error(`Cannot delete category with ${productsCount} active products. Please reassign or delete products first.`);
    }

    // Check if category has children
    const childrenCount = await prisma.category.count({
      where: {
        parent_id: id,
        is_deleted: false,
      },
    });

    if (childrenCount > 0) {
      throw new Error(`Cannot delete category with ${childrenCount} subcategories. Please delete or reassign subcategories first.`);
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });

    return category;
  }

  /**
   * Get category tree (hierarchical structure)
   */
  async getTree() {
    const categories = await prisma.category.findMany({
      where: {
        is_deleted: false,
        is_active: true,
      },
      include: {
        children: {
          where: {
            is_deleted: false,
            is_active: true,
          },
          include: {
            _count: {
              select: {
                products: {
                  where: { is_deleted: false },
                },
              },
            },
          },
        },
        _count: {
          select: {
            products: {
              where: { is_deleted: false },
            },
          },
        },
      },
      orderBy: [
        { sort_order: 'asc' },
        { name: 'asc' },
      ],
    });

    // Build tree structure (only root categories)
    const tree = categories.filter(cat => !cat.parent_id);
    return tree;
  }

  /**
   * Check for circular reference in category hierarchy
   */
  async checkCircularReference(categoryId, parentId) {
    let currentParentId = parentId;

    while (currentParentId) {
      if (currentParentId === categoryId) {
        return true;
      }

      const parent = await prisma.category.findUnique({
        where: { id: currentParentId },
        select: { parent_id: true },
      });

      currentParentId = parent?.parent_id;
    }

    return false;
  }

  /**
   * Get categories for dropdown (simple list)
   */
  async getForDropdown() {
    const categories = await prisma.category.findMany({
      where: {
        is_deleted: false,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        parent_id: true,
      },
      orderBy: [
        { sort_order: 'asc' },
        { name: 'asc' },
      ],
    });

    return categories;
  }
}

export default new CategoriesService();
