const fs = require('node:fs');
const {changelogEntry} = require('./release.cjs');
module.exports = {
  plugins: {},
  git: {
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
    release: true,
    draft: true,
    releaseName: 'v${version}',
    tokenRef: 'GH_TOKEN',
    releaseNotes: ({version}) => changelogEntry(fs.readFileSync('CHANGELOG.md', 'utf8'), version),
  },
};
