import type { ArgumentsCamelCase } from 'yargs';
export declare enum Tools {
    VSCode = "vscode"
}
interface ExtensionsArgs {
    tools: Tools[];
}
export declare function handleExtensions(args: ArgumentsCamelCase<ExtensionsArgs>): Promise<void>;
export {};
