import {computePackPath} from '../cli/git_helpers';

describe('Git helpers', () => {
  describe('computePackPath', () => {
    it('extracts path after /packs/ directory', () => {
      assert.equal(computePackPath('/Users/dev/packs/google/calendar'), 'google/calendar');
      assert.equal(computePackPath('/Users/dev/packs/slack/main'), 'slack/main');
      assert.equal(computePackPath('/Users/dev/packs/atlassian/jira/cloud'), 'atlassian/jira/cloud');
    });

    it('handles packs at different depths', () => {
      assert.equal(computePackPath('/home/user/projects/packs/simple'), 'simple');
      assert.equal(computePackPath('/packs/test'), 'test');
    });

    it('falls back to last two components when no /packs/ in path', () => {
      assert.equal(computePackPath('/some/other/path/my-pack'), 'path/my-pack');
      assert.equal(computePackPath('/deep/nested/structure/org/pack-name'), 'org/pack-name');
    });

    it('handles single directory fallback', () => {
      assert.equal(computePackPath('/single'), 'single');
    });

    it('handles Windows-style paths with forward slashes', () => {
      // path.resolve normalizes to forward slashes
      assert.equal(computePackPath('/c/Users/dev/packs/google/calendar'), 'google/calendar');
    });
  });

  // Note: Git state tests (getGitState, createGitTag, etc.) require actual git repos
  // and are better suited for integration tests. The computePackPath function is
  // the main unit-testable component.
});
