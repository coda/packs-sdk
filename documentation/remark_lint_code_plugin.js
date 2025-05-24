// Plugin for the remark-lint-code extension, for linting the TypeScript code
// in the documentation markdown files.
// Based off of https://github.com/Qard/remark-lint-code-eslint
// Updated to use eslint 8 and handle specific patterns in our samples.

const {ESLint} = require('eslint');

module.exports = function (_options) {
  const eslint = new ESLint();
  
  return async function (node, file) {
    if (node.meta) {
      let attrs = node.meta.split(/\s+/);
      if (attrs.includes('no_lint')) {
        return;
      }
    }
    const code = fixCode(node.value);
    const results = await eslint.lintText(code, {
      filePath: file.path
    });
    results[0]?.messages?.forEach(message => {
      // Combine position of fenced code block with position
      // of code within the code block to produce actual location
      const pos = {
        line: node.position.start.line + message.line,
        column: message.column
      }
      const msg = `${message.message} [${message.ruleId}]`; 
      switch (message.severity) {
        case 1:
          file.message(msg, pos)
          break
        case 2:
          try {
            file.fail(msg, pos)
          } catch (err) {}
          break
      }
    });
  }
}

function fixCode(code) {
  return code
    .replaceAll('{% raw %}', '')
    .replaceAll('{% endraw %}', '')
    .trim()
    // Allow for code snippets that only include a key-value pair.
    // Before: 
    //   foo: "bar",
    // After: 
    //   // eslint-disable-next-line func-style
    //   let value = "bar";
    .replace(/^\w+\:(.*),$/ms, '// eslint-disable-next-line func-style\nlet value = $1;');
}
