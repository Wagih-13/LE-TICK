/**
 * Orders Routes
 * API routes for order management
 */

import express from 'express';
import * as ordersController from './orders.controller.js';
import { authenticate, optionalAuth } from '../../common/middleware/auth.js';
import { authorize } from '../../common/middleware/authorize.js';

const router = express.Router();

// Statistics endpoint (must be before /:id routes)
router.get('/admin/statistics', 
  authenticate, 
  authorize(['ADMIN', 'MANAGER']), 
  ordersController.statistics
);

// Guest order tracking (must be before /:id route)
router.get('/track/:orderNumber', ordersController.getByOrderNumber);

// Customer routes (create allows guest checkout)
router.post('/', optionalAuth, ordersController.create);
router.get('/', authenticate, ordersController.list);
router.get('/:id', optionalAuth, ordersController.getById);
router.post('/:id/cancel', authenticate, ordersController.cancel);

// Admin routes
router.put('/:id/status', 
  authenticate, 
  authorize(['ADMIN', 'MANAGER']), 
  ordersController.updateStatus
);

export default router;
