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
    status?: ExampleStatus;
}
export interface CompiledExampleSnippet {
    name: string;
    content: string;
    code: string;
    status?: ExampleStatus;
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
    status?: ExampleStatus;
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
    status?: ExampleStatus;
}
export interface LinkData {
    type: UrlType;
    url?: string;
}
export declare enum UrlType {
    SamplePage = "SamplePage",
    SdkReferencePath = "SdkReferencePath",
    Web = "Web"
}
export declare enum ExampleCategory {
    Topic = "Topic",
    Full = "Full"
}
export declare enum ExampleStatus {
    Beta = "Beta"
}
export interface VSCodeSnippet {
    scope: string;
    prefix: string;
    body: string;
    description: string;
}
export type VSCodeSnippets = Record<string, VSCodeSnippet>;
