/**
 * @file Custom lint rule for remark-lint that warns when a smart quote (curly quote) is found.
 */

import {lintRule} from 'unified-lint-rule'
import {visit} from 'unist-util-visit'

const RuleName = 'remark-lint:no-smart-quotes'

// Characters: ‘ ’ “ ”
const SmartQuoteRegex = /[\u2018\u2019\u201C\u201D]/g

const Replacements = {
  '\u2018': "'", // left single
  '\u2019': "'", // right single
  '\u201C': '"', // left double
  '\u201D': '"'  // right double
}

export default lintRule(RuleName, noSmartQuotes)

function noSmartQuotes(tree, file) {
  visit(tree, 'text', node => {
    const value = node.value
    if (!value) {return}

    let match
    while ((match = SmartQuoteRegex.exec(value)) !== null) {
      const index = match.index
      const char = match[0]
      const pos = computePosition(node, index)

      const suggestion = Replacements[char]
      const message = `Smart quote ${JSON.stringify(char)} found — use ${JSON.stringify(suggestion)} instead.`

      file.message(message, pos)
    }
  })
}

function computePosition(node, index) {
  const start = node.position?.start ?? {line: 1, column: 1}
  const before = node.value.slice(0, index)

  const lastNewline = before.lastIndexOf('\n')

  if (lastNewline === -1) {
    return {
      line: start.line,
      column: start.column + index
    }
  }

  const lines = before.split('\n')
  const extraLines = lines.length - 1
  const lastLineLength = lines[lines.length - 1].length

  return {
    line: start.line + extraLines,
    column: lastLineLength + 1
  }
}
