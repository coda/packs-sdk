'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var MessageIds;
(function(MessageIds) {
  MessageIds['NonCompliantOrdering'] = 'NonCompliantOrdering';
})((MessageIds = exports.MessageIds || (exports.MessageIds = {})));
exports.rule = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Stylistic Issues',
      description: `Requires and auto-fixes import ordering to meet Coda's style guidelines.`,
      recommended: false,
      url: '',
    },
    fixable: 'code',
    messages: {
      [MessageIds.NonCompliantOrdering]: 'Imports must follow Coda style guidelines.',
    },
    schema: [],
  },
  create: context => {
    /*
        Sort order is
        - side effect test helpers
        - main 'testHelper'
        - supplementary testHelpers
        - side effect imports
        - remaining imports
         */
    function getSortKeyFromImport(node) {
      // Take the first specifier. Multiple specifiers are handled by 'coda-import-style'
      const specifier = node.specifiers[0];
      const importName = specifier ? specifier.local.name : '';
      const moduleName = node.source.raw;
      let precedence = -1;
      if (moduleName.endsWith(`/test_helper'`) || moduleName.endsWith(`_test_helper'`)) {
        if (!importName) {
          precedence = 4;
        } else if (importName === 'testHelper') {
          precedence = 3;
        } else if (importName.endsWith('TestHelper')) {
          precedence = 2;
        }
      }
      if (precedence === -1) {
        precedence = importName ? 0 : 1;
      }
      const sortKey = `${importName}-${moduleName}`;
      if (precedence > 0) {
        return `${'!'.repeat(precedence)}${sortKey}`;
      }
      return sortKey;
    }
    let State;
    (function(State) {
      State[(State['Start'] = 0)] = 'Start';
      State[(State['ProcessingImports'] = 1)] = 'ProcessingImports';
      State[(State['TraversingImport'] = 2)] = 'TraversingImport';
      State[(State['FinishedImports'] = 3)] = 'FinishedImports';
    })(State || (State = {}));
    const sourceLines = context.getSourceCode().lines;
    const imports = [];
    let importStart = 1; // Lines are 1-indexed
    let state = State.Start;
    return {
      ImportDeclaration: node => {
        if (state === State.FinishedImports) {
          return;
        }
        state = State.TraversingImport;
        const importEnd = node.loc.end.line + 1;
        // Take all lines preceding the import since the last import
        // So we preserve comment placement (e.g., eslint ignore comments and such)
        imports.push({
          lines: sourceLines.slice(importStart - 1, importEnd - 1),
          sortKey: getSortKeyFromImport(node),
          start: node.loc.start,
          end: node.loc.end,
        });
        importStart = importEnd;
      },
      'ImportDeclaration:exit': () => {
        if (state === State.TraversingImport) {
          state = State.ProcessingImports;
        }
      },
      ':not(ImportDeclaration)': () => {
        if (state !== State.TraversingImport && state !== State.Start) {
          state = State.FinishedImports;
        }
      },
      'Program:exit': node => {
        if (state === State.Start) {
          // No imports were found
          return;
        }
        const sortedImports = [...imports].sort((a, b) => (a.sortKey < b.sortKey ? -1 : a.sortKey > b.sortKey ? 1 : 0));
        if (!sortedImports.every((imp, i) => imp === imports[i])) {
          context.report({
            messageId: MessageIds.NonCompliantOrdering,
            node,
            loc: {start: imports[0].start, end: imports[imports.length - 1].end},
            fix: fixer => {
              const fullText = sortedImports.map(imp => imp.lines.join('\n')).join('\n');
              // Since we just grabbed the lines as-is, fullText should be the same length as the text we're replacing
              return fixer.replaceTextRange([0, fullText.length], fullText);
            },
          });
        }
      },
    };
  },
};
