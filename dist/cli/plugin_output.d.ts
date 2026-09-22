export type PluginOutput = 'text' | 'json';
export declare function isExistingPlugin(pluginJsonPath: string, expectedName: string): boolean;
export declare function formatScaffoldResult(pluginName: string, targetDir: string, status: 'created' | 'unchanged', output: PluginOutput): string;
