import type { ArgumentsCamelCase } from 'yargs';
import type { PluginListing } from '../plugin/listing';
import type { PluginComponentMetadata } from '../plugin/listing';
interface AddPluginArgs {
    name?: string;
}
interface PluginJsonArgs {
    pluginJson?: string;
}
export declare function handleAddPlugin({ name }: ArgumentsCamelCase<AddPluginArgs>): Promise<never>;
export declare function handlePluginValidate({ pluginJson }: ArgumentsCamelCase<PluginJsonArgs>): Promise<never>;
export declare function handlePluginPlan({ pluginJson }: ArgumentsCamelCase<PluginJsonArgs>): Promise<never>;
export declare function validatePluginComponents(listing: PluginListing, pluginRoot: string): Promise<PluginComponentMetadata>;
export {};
