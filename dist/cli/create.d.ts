import type { ArgumentsCamelCase } from 'yargs';
interface CreateArgs {
    manifestFile: string;
    apiEndpoint: string;
    name?: string;
    description?: string;
    workspace?: string;
    apiToken?: string;
}
export declare function handleCreate({ manifestFile, apiEndpoint, name, description, workspace, apiToken, }: ArgumentsCamelCase<CreateArgs>): Promise<void>;
export declare function createPack(manifestFile: string, apiEndpoint: string, { name, description, workspace }: {
    name?: string;
    description?: string;
    workspace?: string;
}, apiToken?: string): Promise<never>;
export {};
