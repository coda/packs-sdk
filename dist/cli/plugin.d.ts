import type { ArgumentsCamelCase } from 'yargs';
interface AddPluginArgs {
    name?: string;
}
interface BundlePluginArgs {
    pluginJson?: string;
}
export declare function handleAddPlugin({ name }: ArgumentsCamelCase<AddPluginArgs>): Promise<never>;
export declare function handlePluginValidate({ pluginJson }: ArgumentsCamelCase<BundlePluginArgs>): Promise<never>;
export declare function handlePluginPlan({ pluginJson }: ArgumentsCamelCase<BundlePluginArgs>): Promise<never>;
export {};
