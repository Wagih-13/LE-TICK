/**
 * Rate Limiting Middleware
 * Prevents abuse and DDoS attacks
 */

import rateLimit from 'express-rate-limit';
import config from '../config/env.js';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs, // 15 minutes default
  max: config.rateLimitMaxRequests, // 100 requests per window default
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth routes
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
});
