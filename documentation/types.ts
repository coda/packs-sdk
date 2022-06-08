export interface AutocompleteSnippet {
  triggerTokens: string[];
  content: string;
  codeFile: string;
}

export interface CompiledAutocompleteSnippet {
  // The first item in triggerTokens is used as the autocomplete label in the packs IDE
  triggerTokens: string[];
  content: string;
  code: string;
}

export interface ExampleSnippet {
  name: string;
  content: string;
  codeFile: string;
}

export interface CompiledExampleSnippet {
  name: string;
  content: string;
  code: string;
}

export interface Example {
  name: string;
  description: string;
  icon?: string;
  category: ExampleCategory;
  triggerTokens: string[];
  linkData: LinkData;
  contentFile: string;
  exampleSnippets: ExampleSnippet[];
}

export interface CompiledExample {
  name: string;
  description: string;
  icon?: string;
  category: ExampleCategory;
  triggerTokens: string[];
  exampleFooterLink: string;
  learnMoreLink?: string;
  content: string;
  exampleSnippets: CompiledExampleSnippet[];
}

export interface LinkData {
  type: UrlType;
  url?: string;
}

export enum UrlType {
  SamplePage = 'SamplePage',
  SdkReferencePath = 'SdkReferencePath',
  Web = 'Web',
}

export enum ExampleCategory {
  Topic = 'Topic',
  Full = 'Full',
}
