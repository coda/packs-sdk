interface Snippet {
  name: string,
  slashCommand: string,
  triggerWords: string[],
  content: string,
  code: string,
}

export const Snippets: Snippet[] = [
  {
    name: 'String Formula',
    slashCommand: '/StringFormula',
    triggerWords: ['banana', 'test', 'formula'],
    content: './snippets/string_formula.md',
    code: './snippets/string_formula.ts',
  },
  
]