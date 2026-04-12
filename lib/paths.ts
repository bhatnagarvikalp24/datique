/**
 * Centralised path resolution for file storage.
 *
 * In development: DATA_DIR is not set → files live under process.cwd()
 * On Railway:     set DATA_DIR=/data (mounted persistent volume)
 *                 set DATABASE_URL=file:/data/prod.db
 */

import path from "path";

const DATA_DIR = process.env.DATA_DIR ?? process.cwd();

export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
export const REPORTS_DIR = path.join(DATA_DIR, "reports");

/** Resolve a stored relative path like /uploads/foo.jpg to an absolute path. */
export function resolveStoredPath(storedPath: string): string {
  return path.join(DATA_DIR, storedPath.replace(/^\//, ""));
}
