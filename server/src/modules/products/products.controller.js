/**
 * Products Controller
 * Handles product HTTP requests
 * @module modules/products/controller
 */

import productsService from './products.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../common/utils/response.js';

class ProductsController {
  /**
   * Get all products
   * @route GET /api/products
   * @access Public
   */
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, category, search, sort } = req.query;
      
      const result = await productsService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        category,
        search,
        sort,
      });

      return paginatedResponse(
        res,
        result.products,
        page,
        limit,
        result.total,
        'Products retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product by ID
   * @route GET /api/products/:id
   * @access Public
   */
  async getById(req, res, next) {
    try {
      const product = await productsService.getById(req.params.id);
      return successResponse(res, { product }, 'Product retrieved successfully');
    } catch (error) {
      if (error.message === 'Product not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Create product
   * @route POST /api/products
   * @access Private (Admin/Manager)
   */
  async create(req, res, next) {
    try {
      const product = await productsService.create(req.body);
      return successResponse(res, { product }, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product
   * @route PUT /api/products/:id
   * @access Private (Admin/Manager)
   */
  async update(req, res, next) {
    try {
      const product = await productsService.update(req.params.id, req.body);
      return successResponse(res, { product }, 'Product updated successfully');
    } catch (error) {
      if (error.message === 'Product not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Delete product
   * @route DELETE /api/products/:id
   * @access Private (Admin/Manager)
   */
  async delete(req, res, next) {
    try {
      await productsService.delete(req.params.id);
      return successResponse(res, null, 'Product deleted successfully');
    } catch (error) {
      if (error.message === 'Product not found') {
        return errorResponse(res, error.message, 404);
      }
      next(error);
    }
  }

  /**
   * Get featured products
   * @route GET /api/products/featured
   * @access Public
   */
  async getFeatured(req, res, next) {
    try {
      const products = await productsService.getFeatured();
      return successResponse(res, { products }, 'Featured products retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get first collection products
   * @route GET /api/products/first-collection
   * @access Public
   */
  async getFirstCollection(req, res, next) {
    try {
      const products = await productsService.getFirstCollection();
      return successResponse(res, { products }, 'First collection products retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductsController();
