const base = require('../../.release-it.json');
const {execFileSync} = require('node:child_process');
const live = process.env.RELEASE_DRY_RUN === 'false';
module.exports = {
  ...base,
  git: {
    ...base.git,
    requireUpstream: false,
    commit: live,
    tag: false,
    push: live,
    addUntrackedFiles: true,
    pushArgs: ['--set-upstream'],
    // An explicit URL avoids the original branch cached before the branch-creation hook.
    pushRepo: execFileSync('git', ['remote', 'get-url', '--push', 'origin'], {encoding: 'utf8'}).trim(),
  },
  npm: {publish: false},
  github: {release: false},
  hooks: {
    'before:git:beforeRelease': [
      'git switch -c release/v${version}',
      '.pnpm_install/bin/pnpm install --frozen-lockfile',
      'make build',
    ],
  },
};
