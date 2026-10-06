const {fixupPluginRules} = require('@eslint/compat');
module.exports = fixupPluginRules(require('eslint-plugin-prefer-let'));
