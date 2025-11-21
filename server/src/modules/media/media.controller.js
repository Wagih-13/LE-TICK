/**
 * Media Controller
 * Handles image uploads and processing (WebP conversion & compression)
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { successResponse, errorResponse } from '../../common/utils/response.js';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function toWebpFilename(originalName = '') {
  const base = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${base}.webp`;
}

async function processToWebp(buffer) {
  // Auto-rotate using EXIF, convert to WebP with good quality and effort
  return sharp(buffer)
    .rotate()
    .webp({ quality: 82, effort: 4, smartSubsample: true })
    .toBuffer();
}

export async function uploadSingle(req, res) {
  try {
    ensureUploadsDir();

    const file = req.file;
    if (!file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    if (!file.mimetype.startsWith('image/')) {
      return errorResponse(res, 'Only image files are allowed', 400);
    }

    const webpBuffer = await processToWebp(file.buffer);
    const filename = toWebpFilename(file.originalname);
    const filepath = path.join(UPLOADS_DIR, filename);

    await fs.promises.writeFile(filepath, webpBuffer);

    const xfProto = req.headers['x-forwarded-proto'];
    const proto = Array.isArray(xfProto) ? xfProto[0] : (xfProto || req.protocol);
    const host = req.get('host');
    const base = host ? `${proto}://${host}` : '';
    const url = `${base}/uploads/${filename}`;
    return successResponse(res, { url }, 'Image uploaded successfully', 201);
  } catch (err) {
    console.error('Upload error:', err);
    return errorResponse(res, 'Failed to process image upload', 500);
  }
}

export async function uploadMultiple(req, res) {
  try {
    ensureUploadsDir();

    const files = req.files || [];
    if (!Array.isArray(files) || files.length === 0) {
      return errorResponse(res, 'No files uploaded', 400);
    }

    const urls = [];
    for (const file of files) {
      if (!file.mimetype.startsWith('image/')) {
        continue;
      }
      const webpBuffer = await processToWebp(file.buffer);
      const filename = toWebpFilename(file.originalname);
      const filepath = path.join(UPLOADS_DIR, filename);
      await fs.promises.writeFile(filepath, webpBuffer);
      const xfProto = req.headers['x-forwarded-proto'];
      const proto = Array.isArray(xfProto) ? xfProto[0] : (xfProto || req.protocol);
      const host = req.get('host');
      const base = host ? `${proto}://${host}` : '';
      urls.push(`${base}/uploads/${filename}`);
    }

    if (urls.length === 0) {
      return errorResponse(res, 'No valid image files were uploaded', 400);
    }

    return successResponse(res, { urls }, 'Images uploaded successfully', 201);
  } catch (err) {
    console.error('Upload error:', err);
    return errorResponse(res, 'Failed to process images upload', 500);
  }
}

export default {
  uploadSingle,
  uploadMultiple,
};
