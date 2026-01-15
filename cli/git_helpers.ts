import {execSync} from 'child_process';
import path from 'path';

/**
 * Represents the current state of the git repository.
 */
export interface GitState {
  /** Whether the directory is inside a git repository */
  isGitRepo: boolean;
  /** Whether there are uncommitted changes (staged or unstaged) */
  isDirty: boolean;
  /** The current branch name, or undefined if detached HEAD */
  currentBranch: string | undefined;
  /** The full SHA of the current commit */
  commitSha: string | undefined;
}

/**
 * Gets the current git state for the given directory.
 * Returns a safe default if not in a git repo or git is not available.
 */
export function getGitState(manifestDir: string): GitState {
  const cwd = path.resolve(manifestDir);

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

/**
 * Checks if the given directory is inside a git repository.
 */
function isGitRepo(cwd: string): boolean {
  try {
    execSync('git rev-parse --is-inside-work-tree', {cwd, stdio: 'pipe'});
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if there are any uncommitted changes (staged or unstaged).
 */
function hasUncommittedChanges(cwd: string): boolean {
  try {
    const status = execSync('git status --porcelain', {cwd, encoding: 'utf-8'});
    return status.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * Gets the current branch name.
 * Returns undefined if in detached HEAD state or on error.
 */
function getCurrentBranch(cwd: string): string | undefined {
  try {
    const branch = execSync('git branch --show-current', {cwd, encoding: 'utf-8'}).trim();
    return branch || undefined; // Empty string means detached HEAD
  } catch {
    return undefined;
  }
}

/**
 * Gets the full SHA of the current HEAD commit.
 */
function getCommitSha(cwd: string): string | undefined {
  try {
    return execSync('git rev-parse HEAD', {cwd, encoding: 'utf-8'}).trim();
  } catch {
    return undefined;
  }
}

/**
 * Creates a git tag at the current HEAD.
 * Returns true if successful, false otherwise.
 */
export function createGitTag(tag: string, cwd: string): boolean {
  try {
    execSync(`git tag "${tag}"`, {cwd, stdio: 'pipe'});
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a git tag already exists.
 */
export function gitTagExists(tag: string, cwd: string): boolean {
  try {
    execSync(`git rev-parse "refs/tags/${tag}"`, {cwd, stdio: 'pipe'});
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if git is available on the system.
 */
export function isGitAvailable(): boolean {
  try {
    execSync('git --version', {stdio: 'pipe'});
    return true;
  } catch {
    return false;
  }
}
