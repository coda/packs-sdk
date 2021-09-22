import type { Arguments } from 'yargs';
interface CreateArgs {
    manifestFile: string;
    codaApiEndpoint: string;
    name?: string;
    description?: string;
    workspaceId?: string;
}
export declare function handleCreate({ manifestFile, codaApiEndpoint, name, description, workspaceId }: Arguments<CreateArgs>): Promise<void>;
export declare function createPack(manifestFile: string, codaApiEndpoint: string, { name, description, workspaceId }: {
    name?: string;
    description?: string;
    workspaceId?: string;
}): Promise<never>;
export {};
