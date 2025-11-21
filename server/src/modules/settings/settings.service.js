/**
 * Settings Service
 * Manage site-wide configuration stored in SiteSetting model
 */

import prisma from '../../common/config/database.js';

const toTypedValue = (value, type) => {
  if (value === null || value === undefined) return null;
  switch ((type || 'string').toLowerCase()) {
    case 'number':
      return Number(value);
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number') return value !== 0;
      return String(value).toLowerCase() === 'true';
    default:
      return String(value);
  }
};

export const getPublicSettings = async () => {
  const rows = await prisma.siteSetting.findMany({
    where: { is_public: true },
    orderBy: { key: 'asc' },
  });
  const settings = {};
  for (const row of rows) {
    settings[row.key] = toTypedValue(row.value, row.type);
  }
  return settings;
};

export const getAllSettings = async () => {
  return prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
};

export const updateSetting = async (key, { value, type, description, is_public }) => {
  // Normalize to string storage
  let storedValue = value;
  const t = (type || 'string').toLowerCase();
  if (t === 'number' && value !== null && value !== undefined) storedValue = String(value);
  if (t === 'boolean' && typeof value === 'boolean') storedValue = value ? 'true' : 'false';

  const updated = await prisma.siteSetting.upsert({
    where: { key },
    update: {
      value: storedValue,
      type: t,
      ...(description !== undefined ? { description } : {}),
      ...(is_public !== undefined ? { is_public } : {}),
    },
    create: {
      key,
      value: storedValue ?? null,
      type: t,
      description: description ?? null,
      is_public: is_public ?? false,
    },
  });
  return updated;
};

export const getNumber = async (key, fallback) => {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  if (!row || row.value === null || row.value === undefined) return fallback;
  const n = Number(row.value);
  return Number.isNaN(n) ? fallback : n;
};

export default {
  getPublicSettings,
  getAllSettings,
  updateSetting,
  getNumber,
};
