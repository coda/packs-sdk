"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLockFilePath = exports.addReleaseToLockFile = exports.writeLockFile = exports.readLockFile = exports.lockFileExists = exports.LOCK_FILE_NAME = void 0;
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../testing/helpers");
const helpers_2 = require("../testing/helpers");
exports.LOCK_FILE_NAME = '.coda-pack.lock.json';
/**
 * Checks if a lock file exists in the given manifest directory.
 * The existence of this file indicates that release tracking is enabled.
 */
function lockFileExists(manifestDir) {
    const lockFilePath = path_1.default.join(manifestDir, exports.LOCK_FILE_NAME);
    return (0, helpers_1.readFile)(lockFilePath) !== undefined;
}
exports.lockFileExists = lockFileExists;
/**
 * Reads and parses the lock file from the manifest directory.
 * Returns undefined if the file doesn't exist.
 */
function readLockFile(manifestDir) {
    const lockFilePath = path_1.default.join(manifestDir, exports.LOCK_FILE_NAME);
    const content = (0, helpers_1.readFile)(lockFilePath);
    if (!content) {
        return undefined;
    }
    try {
        return JSON.parse(content.toString());
    }
    catch {
        // If file is corrupted or invalid JSON, return empty lock file
        return { releases: [] };
    }
}
exports.readLockFile = readLockFile;
/**
 * Writes the lock file to the manifest directory.
 * Creates the file if it doesn't exist.
 */
function writeLockFile(manifestDir, lockFile) {
    const lockFilePath = path_1.default.join(manifestDir, exports.LOCK_FILE_NAME);
    (0, helpers_2.writeJSONFile)(lockFilePath, lockFile);
}
exports.writeLockFile = writeLockFile;
/**
 * Adds a new release entry to the lock file.
 * The new release is added at the beginning (most recent first).
 * Creates the lock file if it doesn't exist.
 */
function addReleaseToLockFile(manifestDir, release) {
    const lockFile = readLockFile(manifestDir) || { releases: [] };
    // Check if this version already exists (prevent duplicates)
    const existingIndex = lockFile.releases.findIndex(r => r.version === release.version);
    if (existingIndex !== -1) {
        // Update existing entry instead of adding duplicate
        lockFile.releases[existingIndex] = release;
    }
    else {
        // Add new release at the beginning (most recent first)
        lockFile.releases.unshift(release);
    }
    writeLockFile(manifestDir, lockFile);
}
exports.addReleaseToLockFile = addReleaseToLockFile;
/**
 * Gets the path to the lock file for a given manifest directory.
 */
function getLockFilePath(manifestDir) {
    return path_1.default.join(manifestDir, exports.LOCK_FILE_NAME);
}
exports.getLockFilePath = getLockFilePath;
