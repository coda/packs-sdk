export interface AutocompleteSnippet {
    triggerTokens: string[];
    content: string;
    codeFile: string;
}
export interface CompiledAutocompleteSnippet {
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
    triggerTokens: string[];
    sdkReferencePath: string;
    contentFile: string;
    exampleSnippets: ExampleSnippet[];
}
export interface CompiledExample {
    name: string;
    triggerTokens: string[];
    sdkReferencePath: string;
    content: string;
    exampleSnippets: CompiledExampleSnippet[];
}
