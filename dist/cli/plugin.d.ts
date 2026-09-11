import type { ArgumentsCamelCase } from 'yargs';
import type { PluginComponentMetadata } from '../plugin/listing';
import type { PluginListing } from '../plugin/listing';
import type { PluginOutput } from './plugin_output';
interface AddPluginArgs {
    name?: string;
    output: PluginOutput;
}
interface PluginJsonArgs {
    pluginJson?: string;
    output: PluginOutput;
}
export declare function handleAddPlugin({ name, output }: ArgumentsCamelCase<AddPluginArgs>): Promise<never>;
export declare function handlePluginValidate({ pluginJson, output }: ArgumentsCamelCase<PluginJsonArgs>): Promise<never>;
export declare function handlePluginPlan({ pluginJson, output }: ArgumentsCamelCase<PluginJsonArgs>): Promise<never>;
export declare function validatePluginComponents(listing: PluginListing, pluginRoot: string): Promise<PluginComponentMetadata>;
export {};
