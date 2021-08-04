export interface Snippet {
  triggerWords: string[];
  content: string;
  codeFile: string;
}

export interface CompiledSnippet {
  // The first item in triggerWords is used as the autocomplete label in the packs IDE
  triggerWords: string[];
  content: string;
  code: string;
}

export enum Category {
  ColumnFormat = 'ColumnFormat',
  Authentication = 'Authentication',
  DynamicSyncTable = 'DynamicSynctable',
  Formula = 'Formula',
  SyncTable = 'SyncTable',
}

export interface Example {
  contentFile: string;
  codeFiles: string[];
  categories: Category[];
  triggerTokens: string[];
}

export interface CompiledExample {
  content: string;
  code: string[];
  categories: Category[];
  triggerTokens: string[];
}
