/**
 * Settings Routes
 */

import express from 'express';
import settingsController from './settings.controller.js';
import { authenticate } from '../../common/middleware/auth.js';
import { authorize } from '../../common/middleware/authorize.js';

const router = express.Router();

// Public settings (no auth required)
router.get('/', settingsController.getPublic);

// Admin routes
router.get('/all', authenticate, authorize(['ADMIN', 'MANAGER']), settingsController.listAll);
router.put('/:key', authenticate, authorize(['ADMIN', 'MANAGER']), settingsController.update);

export default router;
