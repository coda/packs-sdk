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
export declare enum Category {
    ColumnFormat = "ColumnFormat"
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
