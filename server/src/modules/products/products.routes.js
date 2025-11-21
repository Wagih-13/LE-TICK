/**
 * Products Routes
 * Product endpoints
 * @module modules/products/routes
 */

import express from 'express';
import productsController from './products.controller.js';
import { createProductValidation, updateProductValidation } from './products.validation.js';
import { authenticate, authorize } from '../../common/middleware/auth.js';
import { validate } from '../../common/middleware/validator.js';

const router = express.Router();

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', productsController.getFeatured);

/**
 * @route   GET /api/products/first-collection
 * @desc    Get first collection products
 * @access  Public
 */
router.get('/first-collection', productsController.getFirstCollection);

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', productsController.getAll);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', productsController.getById);

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private (Admin/Manager)
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  createProductValidation,
  validate,
  productsController.create
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private (Admin/Manager)
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  updateProductValidation,
  validate,
  productsController.update
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private (Admin/Manager)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  productsController.delete
);

export default router;
