import type { Arguments } from 'yargs';
interface CreateArgs {
    manifestFile: string;
    codaApiEndpoint: string;
    name?: string;
    description?: string;
    workspaceIdOrUrl?: string;
}
export declare function handleCreate({ manifestFile, codaApiEndpoint, name, description, workspaceIdOrUrl }: Arguments<CreateArgs>): Promise<void>;
export declare function createPack(manifestFile: string, codaApiEndpoint: string, { name, description, workspaceIdOrUrl }: {
    name?: string;
    description?: string;
    workspaceIdOrUrl?: string;
}): Promise<never>;
export {};
