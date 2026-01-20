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
export declare function getGitState(manifestDir: string): GitState;
/**
 * Creates an annotated git tag at the current HEAD.
 * Returns true if successful, false otherwise.
 */
export declare function createGitTag(tag: string, message: string, cwd: string): boolean;
/**
 * Checks if a git tag already exists.
 */
export declare function gitTagExists(tag: string, cwd: string): boolean;
/**
 * Checks if git is available on the system.
 */
export declare function isGitAvailable(): boolean;
