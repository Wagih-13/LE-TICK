import express from 'express';
import multer from 'multer';
import { authenticate } from '../../common/middleware/auth.js';
import { authorize } from '../../common/middleware/authorize.js';
import mediaController from './media.controller.js';

const router = express.Router();

// Use memory storage so we can process the buffers with sharp
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per image
    files: 10,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Single image upload (field name: image)
router.post(
  '/upload',
  authenticate,
  authorize(['ADMIN', 'MANAGER']),
  upload.single('image'),
  mediaController.uploadSingle
);

// Multiple images upload (field name: images)
router.post(
  '/uploads',
  authenticate,
  authorize(['ADMIN', 'MANAGER']),
  upload.array('images', 10),
  mediaController.uploadMultiple
);

export default router;
