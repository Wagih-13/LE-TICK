/**
 * Auth Routes
 * Authentication endpoints
 * @module modules/auth/routes
 */

import express from 'express';
import authController from './auth.controller.js';
import { registerValidation, loginValidation, refreshTokenValidation } from './auth.validation.js';
import { authenticate } from '../../common/middleware/auth.js';
import { validate } from '../../common/middleware/validator.js';
import { authRateLimiter } from '../../common/middleware/rateLimiter.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  authRateLimiter,
  registerValidation,
  validate,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  authRateLimiter,
  loginValidation,
  validate,
  authController.login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh',
  refreshTokenValidation,
  validate,
  authController.refreshToken
);

export default router;
