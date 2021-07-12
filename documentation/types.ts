export interface Snippet {
  name: string;
  triggerWords: string[];
  content: string;
  codeFile: string;
}

export interface CompiledSnippet {
  name: string;
  triggerWords: string[];
  content: string;
  code: string;
}
