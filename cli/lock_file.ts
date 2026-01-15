import path from 'path';
import {readFile} from '../testing/helpers';
import {writeJSONFile} from '../testing/helpers';

export const LOCK_FILE_NAME = '.coda-pack.lock.json';

/**
 * Represents a single release entry in the lock file.
 */
export interface PackReleaseLockEntry {
  /** The semantic version of the pack (e.g., "1.2.3") */
  version: string;
  /** The monotonically increasing release number from Coda */
  releaseId: number;
  /** ISO 8601 timestamp when the release was created */
  releasedAt: string;
  /** Release notes provided via --notes flag */
  notes: string;
  /** Git commit SHA at time of release, or null if not in a git repo or for historical releases */
  commitSha: string | null;
  /** Git tag created for this release (if in a git repo) */
  gitTag?: string;
}

/**
 * The structure of the .coda-pack.lock.json file.
 * Contains the full release history for a pack.
 */
export interface PackLockFile {
  /** Array of releases, most recent first */
  releases: PackReleaseLockEntry[];
}

/**
 * Checks if a lock file exists in the given manifest directory.
 * The existence of this file indicates that release tracking is enabled.
 */
export function lockFileExists(manifestDir: string): boolean {
  const lockFilePath = path.join(manifestDir, LOCK_FILE_NAME);
  return readFile(lockFilePath) !== undefined;
}

/**
 * Reads and parses the lock file from the manifest directory.
 * Returns undefined if the file doesn't exist.
 */
export function readLockFile(manifestDir: string): PackLockFile | undefined {
  const lockFilePath = path.join(manifestDir, LOCK_FILE_NAME);
  const content = readFile(lockFilePath);
  if (!content) {
    return undefined;
  }
  try {
    return JSON.parse(content.toString()) as PackLockFile;
  } catch {
    // If file is corrupted or invalid JSON, return empty lock file
    return {releases: []};
  }
}

/**
 * Writes the lock file to the manifest directory.
 * Creates the file if it doesn't exist.
 */
export function writeLockFile(manifestDir: string, lockFile: PackLockFile): void {
  const lockFilePath = path.join(manifestDir, LOCK_FILE_NAME);
  writeJSONFile(lockFilePath, lockFile);
}

/**
 * Adds a new release entry to the lock file.
 * The new release is added at the beginning (most recent first).
 * Creates the lock file if it doesn't exist.
 */
export function addReleaseToLockFile(manifestDir: string, release: PackReleaseLockEntry): void {
  const lockFile = readLockFile(manifestDir) || {releases: []};

  // Check if this version already exists (prevent duplicates)
  const existingIndex = lockFile.releases.findIndex(r => r.version === release.version);
  if (existingIndex !== -1) {
    // Update existing entry instead of adding duplicate
    lockFile.releases[existingIndex] = release;
  } else {
    // Add new release at the beginning (most recent first)
    lockFile.releases.unshift(release);
  }

  writeLockFile(manifestDir, lockFile);
}

/**
 * Gets the path to the lock file for a given manifest directory.
 */
export function getLockFilePath(manifestDir: string): string {
  return path.join(manifestDir, LOCK_FILE_NAME);
}
