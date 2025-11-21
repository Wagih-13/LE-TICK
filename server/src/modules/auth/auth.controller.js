/**
 * Auth Controller
 * Handles authentication HTTP requests
 * @module modules/auth/controller
 */

import authService from './auth.service.js';
import { successResponse, errorResponse } from '../../common/utils/response.js';
import { validatePasswordStrength } from '../../common/utils/password.js';

class AuthController {
  /**
   * Register new user
   * @route POST /api/auth/register
   * @access Public
   */
  async register(req, res, next) {
    try {
      const { email, password, first_name, last_name, phone } = req.body;

      // Validate password strength
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return errorResponse(
          res,
          'Password does not meet requirements',
          400,
          passwordValidation.errors
        );
      }

      const result = await authService.register({
        email,
        password,
        first_name,
        last_name,
        phone,
      });

      return successResponse(res, result, 'User registered successfully', 201);
    } catch (error) {
      if (error.message === 'User already exists') {
        return errorResponse(res, error.message, 409);
      }
      next(error);
    }
  }

  /**
   * Login user
   * @route POST /api/auth/login
   * @access Public
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return successResponse(res, result, 'Login successful');
    } catch (error) {
      if (
        error.message === 'Invalid credentials' ||
        error.message === 'Account is not active'
      ) {
        return errorResponse(res, error.message, 401);
      }
      next(error);
    }
  }

  /**
   * Get current user
   * @route GET /api/auth/me
   * @access Private
   */
  async getCurrentUser(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      return successResponse(res, { user }, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * @route POST /api/auth/logout
   * @access Private
   */
  async logout(req, res) {
    return successResponse(res, null, 'Logout successful');
  }

  /**
   * Refresh token
   * @route POST /api/auth/refresh
   * @access Public
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      return successResponse(res, result, 'Token refreshed successfully');
    } catch (error) {
      return errorResponse(res, 'Invalid refresh token', 401);
    }
  }
}

export default new AuthController();
