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
    linkData: LinkData;
    contentFile: string;
    exampleSnippets: ExampleSnippet[];
}
export interface CompiledExample {
    name: string;
    triggerTokens: string[];
    exampleFooterLink: string;
    content: string;
    exampleSnippets: CompiledExampleSnippet[];
}
export interface LinkData {
    type: UrlType;
    url: string;
}
export declare enum UrlType {
    SdkReferencePath = "SdkReferencePath",
    Web = "Web"
}
