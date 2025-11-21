/**
 * Request Logger Middleware
 * Logs all incoming requests
 */

import prisma from '../config/database.js';

export const requestLogger = async (req, res, next) => {
  const start = Date.now();

  // Log after response
  res.on('finish', async () => {
    const duration = Date.now() - start;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    }

    // Log to database (async, don't wait)
    try {
      await prisma.log.create({
        data: {
          level: res.statusCode >= 400 ? 'ERROR' : 'INFO',
          message: `${req.method} ${req.originalUrl}`,
          context: `${res.statusCode} - ${duration}ms`,
          user_id: req.user?.id || null,
          ip_address: req.ip || req.connection.remoteAddress,
          metadata: {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration,
            userAgent: req.get('user-agent'),
          },
        },
      });
    } catch (error) {
      // Silently fail - don't break the request
      console.error('Failed to log request:', error.message);
    }
  });

  next();
};
