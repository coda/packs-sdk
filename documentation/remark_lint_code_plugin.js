// remark-lint-code does not await handlers, so snippet linting must be synchronous.
const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const sdkRoot = path.resolve(__dirname, '..');

module.exports = function () {
  return function (node, file) {
    if (node.meta?.split(/\s+/).includes('no_lint')) return;
    return withTempDir(project => {
      const sourceStyle = [
        'docs/development/testing.md',
        'docs/development/libraries.md',
      ].some(relative => path.resolve(file.path) === path.join(sdkRoot, relative));
      const config = sourceStyle ? '.oxlintrc.docs-source.jsonc' : '.oxlintrc.docs.jsonc';
      const snippet = path.join(project, 'markdown_snippet.ts');
      fs.writeFileSync(snippet, fixCode(node.value));
      let output;
      try {
        output = execFileSync(path.join(sdkRoot, 'node_modules/.bin/oxlint'), [
          '--config', path.join(sdkRoot, config),
          '--disable-nested-config', '--type-aware', '--format', 'json', snippet,
        ], {cwd: project, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']});
      } catch (error) {
        if (error.status !== 1 || !error.stdout) throw error;
        output = error.stdout;
      }
      const result = JSON.parse(output);
      if (!Array.isArray(result.diagnostics)) throw new Error('Missing oxlint diagnostics.');
      for (const message of result.diagnostics) {
        if (message.message.startsWith('Error running JS plugin.')) throw new Error(message.message);
        const span = message.labels?.find(label => label.span)?.span;
        const pos = {
          line: node.position.start.line + (span?.line ?? 1),
          column: span?.column ?? 1,
        };
        const msg = `${message.message} [${message.code ?? 'oxlint'}]`;
        if (message.severity === 'warning') {
          file.message(msg, pos);
        } else {
          try {
            file.fail(msg, pos);
          } catch (error) {
            // VFile records the failure before throwing; report every diagnostic.
          }
        }
      }
    });
  };
};

function withTempDir(callback) {
  const directory = fs.mkdtempSync(path.join(sdkRoot, '.oxlint-'));
  try {
    // Retain SDK compiler options without loading every SDK root for each fence.
    fs.writeFileSync(path.join(directory, 'tsconfig.json'), JSON.stringify({
      extends: '../tsconfig.json',
      include: ['markdown_snippet.ts'],
      exclude: [],
    }));
    return callback(directory);
  } finally {
    fs.rmSync(directory, {recursive: true, force: true});
  }
}

function fixCode(code) {
  return code
    .replaceAll('{% raw %}', '')
    .replaceAll('{% endraw %}', '')
    .trim()
    .replace(/^\w+\:(.*),$/ms, '// oxlint-disable-next-line func-style\nlet value = $1;')
    .replace(/^--8<-- ".*"$/ms, '');
}
