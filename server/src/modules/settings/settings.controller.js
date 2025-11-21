/**
 * Settings Controller
 */

import settingsService from './settings.service.js';
import { successResponse, errorResponse } from '../../common/utils/response.js';

export const getPublic = async (req, res, next) => {
  try {
    const data = await settingsService.getPublicSettings();
    return successResponse(res, data, 'Public settings retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const listAll = async (req, res, next) => {
  try {
    const rows = await settingsService.getAllSettings();
    return successResponse(res, rows, 'All settings retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { key } = req.params;
    if (!key) return errorResponse(res, 'Key is required', 400);
    const updated = await settingsService.updateSetting(key, req.body || {});
    return successResponse(res, updated, 'Setting updated successfully');
  } catch (err) {
    next(err);
  }
};

export default {
  getPublic,
  listAll,
  update,
};
