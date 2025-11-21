/**
 * Orders Controller
 * Handles HTTP requests for order management
 */

import * as ordersService from './orders.service.js';

/**
 * Create new order
 * POST /api/orders
 */
export const create = async (req, res, next) => {
  try {
    const userId = req.user?.id || null; // Allow guest checkout
    const order = await ordersService.createOrder(userId, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List orders
 * GET /api/orders
 */
export const list = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = ['ADMIN', 'MANAGER'].includes(req.user.role);
    const { page, limit, status } = req.query;
    
    const result = await ordersService.getOrders(userId, isAdmin, { 
      page: page ? parseInt(page) : 1, 
      limit: limit ? parseInt(limit) : 10, 
      status 
    });
    
    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 * GET /api/orders/:id
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;
    const isAdmin = req.user ? ['ADMIN', 'MANAGER'].includes(req.user.role) : false;
    
    const order = await ordersService.getOrderById(id, userId, isAdmin);
    
    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by order number (for guest tracking)
 * GET /api/orders/track/:orderNumber
 */
export const getByOrderNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    
    const order = await ordersService.getOrderByNumber(orderNumber);
    
    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status (Admin only)
 * PUT /api/orders/:id/status
 */
export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await ordersService.updateOrderStatus(id, status);
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel order
 * POST /api/orders/:id/cancel
 */
export const cancel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = ['ADMIN', 'MANAGER'].includes(req.user.role);
    
    const order = await ordersService.cancelOrder(id, userId, isAdmin);
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order statistics (Admin only)
 * GET /api/orders/admin/statistics
 */
export const statistics = async (req, res, next) => {
  try {
    const stats = await ordersService.getOrderStatistics();
    
    res.json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  list,
  getById,
  getByOrderNumber,
  updateStatus,
  cancel,
  statistics,
};
