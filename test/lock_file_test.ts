import {
  addReleaseToLockFile,
  getLockFilePath,
  LOCK_FILE_NAME,
  lockFileExists,
  readLockFile,
  writeLockFile,
} from '../cli/lock_file';
import type {PackLockFile, PackReleaseLockEntry} from '../cli/lock_file';
import mockFs from 'mock-fs';
import path from 'path';

const PROJECT_DIR = '/myproject';

describe('Lock file', () => {
  beforeEach(() => {
    mockFs();
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe('lockFileExists', () => {
    it('returns false when lock file does not exist', () => {
      mockFs({
        [PROJECT_DIR]: {},
      });
      assert.isFalse(lockFileExists(PROJECT_DIR));
    });

    it('returns true when lock file exists', () => {
      mockFs({
        [PROJECT_DIR]: {
          [LOCK_FILE_NAME]: '{"releases": []}',
        },
      });
      assert.isTrue(lockFileExists(PROJECT_DIR));
    });
  });

  describe('readLockFile', () => {
    it('returns undefined when lock file does not exist', () => {
      mockFs({
        [PROJECT_DIR]: {},
      });
      assert.isUndefined(readLockFile(PROJECT_DIR));
    });

    it('reads and parses lock file', () => {
      const lockFile: PackLockFile = {
        releases: [
          {
            version: '1.0.0',
            releasedAt: '2026-01-10T10:00:00.000Z',
            notes: 'Initial release',
            commitSha: 'abc123',
            gitTag: 'pack/test/release-v1.0.0',
          },
        ],
      };
      mockFs({
        [PROJECT_DIR]: {
          [LOCK_FILE_NAME]: JSON.stringify(lockFile),
        },
      });

      const result = readLockFile(PROJECT_DIR);
      assert.deepEqual(result, lockFile);
    });

    it('returns empty releases array for corrupted JSON', () => {
      mockFs({
        [PROJECT_DIR]: {
          [LOCK_FILE_NAME]: 'not valid json',
        },
      });

      const result = readLockFile(PROJECT_DIR);
      assert.deepEqual(result, {releases: []});
    });
  });

  describe('writeLockFile', () => {
    it('creates lock file with releases', () => {
      mockFs({
        [PROJECT_DIR]: {},
      });

      const lockFile: PackLockFile = {
        releases: [
          {
            version: '1.0.0',
            releasedAt: '2026-01-10T10:00:00.000Z',
            notes: 'Initial release',
            commitSha: 'abc123',
          },
        ],
      };

      writeLockFile(PROJECT_DIR, lockFile);

      const result = readLockFile(PROJECT_DIR);
      assert.deepEqual(result, lockFile);
    });
  });

  describe('addReleaseToLockFile', () => {
    it('creates lock file if it does not exist', () => {
      mockFs({
        [PROJECT_DIR]: {},
      });

      const release: PackReleaseLockEntry = {
        version: '1.0.0',
        releasedAt: '2026-01-10T10:00:00.000Z',
        notes: 'Initial release',
        commitSha: 'abc123',
      };

      addReleaseToLockFile(PROJECT_DIR, release);

      const result = readLockFile(PROJECT_DIR);
      assert.deepEqual(result?.releases, [release]);
    });

    it('adds new release at the beginning', () => {
      const existingRelease: PackReleaseLockEntry = {
        version: '1.0.0',
        releasedAt: '2026-01-10T10:00:00.000Z',
        notes: 'Initial release',
        commitSha: 'abc123',
      };

      mockFs({
        [PROJECT_DIR]: {
          [LOCK_FILE_NAME]: JSON.stringify({releases: [existingRelease]}),
        },
      });

      const newRelease: PackReleaseLockEntry = {
        version: '2.0.0',
        releasedAt: '2026-01-11T10:00:00.000Z',
        notes: 'New features',
        commitSha: 'def456',
      };

      addReleaseToLockFile(PROJECT_DIR, newRelease);

      const result = readLockFile(PROJECT_DIR);
      assert.equal(result?.releases.length, 2);
      assert.equal(result?.releases[0].version, '2.0.0');
      assert.equal(result?.releases[1].version, '1.0.0');
    });

    it('updates existing release instead of creating duplicate', () => {
      const existingRelease: PackReleaseLockEntry = {
        version: '1.0.0',
        releasedAt: '2026-01-10T10:00:00.000Z',
        notes: 'Initial release',
        commitSha: 'abc123',
      };

      mockFs({
        [PROJECT_DIR]: {
          [LOCK_FILE_NAME]: JSON.stringify({releases: [existingRelease]}),
        },
      });

      const updatedRelease: PackReleaseLockEntry = {
        version: '1.0.0',
        releasedAt: '2026-01-10T11:00:00.000Z',
        notes: 'Updated notes',
        commitSha: 'abc123',
      };

      addReleaseToLockFile(PROJECT_DIR, updatedRelease);

      const result = readLockFile(PROJECT_DIR);
      assert.equal(result?.releases.length, 1);
      assert.equal(result?.releases[0].notes, 'Updated notes');
    });
  });

  describe('getLockFilePath', () => {
    it('returns correct path', () => {
      const result = getLockFilePath(PROJECT_DIR);
      assert.equal(result, path.join(PROJECT_DIR, LOCK_FILE_NAME));
    });
  });
});
