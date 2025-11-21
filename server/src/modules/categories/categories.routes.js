import express from 'express';
import categoriesController from './categories.controller.js';

const router = express.Router();

/**
 * @route   GET /api/categories/tree
 * @desc    Get category tree
 * @access  Public
 */
router.get('/tree', categoriesController.getTree);

/**
 * @route   GET /api/categories/dropdown
 * @desc    Get categories for dropdown
 * @access  Public
 */
router.get('/dropdown', categoriesController.getForDropdown);

/**
 * @route   GET /api/categories/slug/:slug
 * @desc    Get category by slug
 * @access  Public
 */
router.get('/slug/:slug', categoriesController.getBySlug);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', categoriesController.getById);

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', categoriesController.getAll);

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Admin
 */
router.post('/', categoriesController.create);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Admin
 */
router.put('/:id', categoriesController.update);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Admin
 */
router.delete('/:id', categoriesController.delete);

export default router;
