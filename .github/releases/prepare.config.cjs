const base = require('../../.release-it.json');
module.exports = {
  ...base,
  git: {
    ...base.git,
    requireUpstream: false,
    commit: false,
    tag: false,
    push: false,
  },
  npm: {publish: false},
  github: {release: false},
};
