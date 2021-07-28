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
}

export interface CompiledExample {
  content: string;
  code: string[];
  categories: Category[];
}
