const base = require('../../.release-it.json');
module.exports = {
  ...base,
  git: {
    ...base.git,
    commit: false,
    tagName: 'v${version}',
    push: false,
    requireUpstream: false,
  },
  npm: {
    stage: true,
    skipChecks: true,
    tag: 'latest',
    publishArgs: ['--access', 'public', '--ignore-scripts', '--registry', 'https://registry.npmjs.org'],
  },
  hooks: {
    'before:github:release': 'git push origin refs/tags/v${version}',
  },
  github: {
    ...base.github,
    release: true,
    draft: true,
    releaseName: 'Release ${version}',
    tokenRef: 'GH_TOKEN',
  },
};
