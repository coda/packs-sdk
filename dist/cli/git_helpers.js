"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGitAvailable = exports.gitTagExists = exports.createGitTag = exports.getGitState = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
/**
 * Gets the current git state for the given directory.
 * Returns a safe default if not in a git repo or git is not available.
 */
function getGitState(manifestDir) {
    const cwd = path_1.default.resolve(manifestDir);
    if (!isGitRepo(cwd)) {
        return {
            isGitRepo: false,
            isDirty: false,
            currentBranch: undefined,
            commitSha: undefined,
        };
    }
    return {
        isGitRepo: true,
        isDirty: hasUncommittedChanges(cwd),
        currentBranch: getCurrentBranch(cwd),
        commitSha: getCommitSha(cwd),
    };
}
exports.getGitState = getGitState;
/**
 * Checks if the given directory is inside a git repository.
 */
function isGitRepo(cwd) {
    try {
        (0, child_process_1.execSync)('git rev-parse --is-inside-work-tree', { cwd, stdio: 'pipe' });
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Checks if there are any uncommitted changes (staged or unstaged).
 */
function hasUncommittedChanges(cwd) {
    try {
        const status = (0, child_process_1.execSync)('git status --porcelain', { cwd, encoding: 'utf-8' });
        return status.trim().length > 0;
    }
    catch {
        return false;
    }
}
/**
 * Gets the current branch name.
 * Returns undefined if in detached HEAD state or on error.
 */
function getCurrentBranch(cwd) {
    try {
        const branch = (0, child_process_1.execSync)('git branch --show-current', { cwd, encoding: 'utf-8' }).trim();
        return branch || undefined; // Empty string means detached HEAD
    }
    catch {
        return undefined;
    }
}
/**
 * Gets the full SHA of the current HEAD commit.
 */
function getCommitSha(cwd) {
    try {
        return (0, child_process_1.execSync)('git rev-parse HEAD', { cwd, encoding: 'utf-8' }).trim();
    }
    catch {
        return undefined;
    }
}
/**
 * Creates a git tag at the current HEAD.
 * Returns true if successful, false otherwise.
 */
function createGitTag(tag, cwd) {
    try {
        (0, child_process_1.execSync)(`git tag "${tag}"`, { cwd, stdio: 'pipe' });
        return true;
    }
    catch {
        return false;
    }
}
exports.createGitTag = createGitTag;
/**
 * Checks if a git tag already exists.
 */
function gitTagExists(tag, cwd) {
    try {
        (0, child_process_1.execSync)(`git rev-parse "refs/tags/${tag}"`, { cwd, stdio: 'pipe' });
        return true;
    }
    catch {
        return false;
    }
}
exports.gitTagExists = gitTagExists;
/**
 * Checks if git is available on the system.
 */
function isGitAvailable() {
    try {
        (0, child_process_1.execSync)('git --version', { stdio: 'pipe' });
        return true;
    }
    catch {
        return false;
    }
}
exports.isGitAvailable = isGitAvailable;
