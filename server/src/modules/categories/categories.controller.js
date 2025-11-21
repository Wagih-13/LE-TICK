import categoriesService from './categories.service.js';
import { successResponse, errorResponse } from '../../common/utils/response.js';

class CategoriesController {
  /**
   * Get all categories
   * @route GET /api/categories
   * @access Public
   */
  async getAll(req, res, next) {
    try {
      const { page, limit, search, parent_id, is_active } = req.query;
      
      const result = await categoriesService.getAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search,
        parent_id,
        is_active,
      });

      return successResponse(res, result, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get category by ID
   * @route GET /api/categories/:id
   * @access Public
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoriesService.getById(id);
      return successResponse(res, { category }, 'Category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get category by slug
   * @route GET /api/categories/slug/:slug
   * @access Public
   */
  async getBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const category = await categoriesService.getBySlug(slug);
      return successResponse(res, { category }, 'Category retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get category tree
   * @route GET /api/categories/tree
   * @access Public
   */
  async getTree(req, res, next) {
    try {
      const tree = await categoriesService.getTree();
      return successResponse(res, { categories: tree }, 'Category tree retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get categories for dropdown
   * @route GET /api/categories/dropdown
   * @access Public
   */
  async getForDropdown(req, res, next) {
    try {
      const categories = await categoriesService.getForDropdown();
      return successResponse(res, { categories }, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new category
   * @route POST /api/categories
   * @access Admin
   */
  async create(req, res, next) {
    try {
      const category = await categoriesService.create(req.body);
      return successResponse(res, { category }, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update category
   * @route PUT /api/categories/:id
   * @access Admin
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoriesService.update(id, req.body);
      return successResponse(res, { category }, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete category
   * @route DELETE /api/categories/:id
   * @access Admin
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await categoriesService.delete(id);
      return successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoriesController();
