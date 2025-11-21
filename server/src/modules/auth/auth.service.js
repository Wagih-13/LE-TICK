/**
 * Auth Service
 * Business logic for authentication
 * @module modules/auth/service
 */

import prisma from '../../common/config/database.js';
import { hashPassword, comparePassword } from '../../common/utils/password.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../../common/utils/jwt.js';

class AuthService {
  /**
   * Register new user
   */
  async register(userData) {
    const { email, password, first_name, last_name, phone } = userData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        role: 'CUSTOMER',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        created_at: true,
      },
    });

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { user, token, refreshToken };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.is_deleted) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password_hash);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      throw new Error('Account is not active');
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token, refreshToken };
  }

  /**
   * Get current user
   */
  async getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        avatar_url: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user || user.is_deleted) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.is_deleted) {
        throw new Error('User not found');
      }

      const newToken = generateToken(user.id);
      const newRefreshToken = generateRefreshToken(user.id);

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

export default new AuthService();
