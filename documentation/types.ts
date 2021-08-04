export interface AutocompleteSnippet {
  triggerWords: string[];
  content: string;
  codeFile: string;
}

export interface CompiledAutocompleteSnippet {
  // The first item in triggerWords is used as the autocomplete label in the packs IDE
  triggerWords: string[];
  content: string;
  code: string;
}

export interface ExampleSnippet {
  content: string;
  codeFile: string;
}

export interface CompiledExampleSnippet {
  name: string;
  content: string;
  code: string;
}

export interface Example {
  tokens: string[];
  referencePath: string;
  contentFile: string;
  exampleSnippets: ExampleSnippet[];
}

export interface CompiledExample {
  tokens: string[];
  referencePath: string;
  content: string;
  exampleSnippets: CompiledExampleSnippet[];
}
