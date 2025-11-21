/**
 * Authorization Middleware
 * Check if user has required role(s)
 */

/**
 * Authorize middleware factory
 * @param {string[]} roles - Array of allowed roles
 * @returns {Function} Express middleware
 */
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

export default authorize;
