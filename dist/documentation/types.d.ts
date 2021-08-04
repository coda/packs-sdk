export interface Snippet {
    triggerWords: string[];
    content: string;
    codeFile: string;
}
export interface CompiledSnippet {
    triggerWords: string[];
    content: string;
    code: string;
}
export declare enum Category {
    ColumnFormat = "ColumnFormat",
    Authentication = "Authentication",
    DynamicSyncTable = "DynamicSynctable",
    Formula = "Formula",
    SyncTable = "SyncTable"
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
