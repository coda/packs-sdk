import type { Arguments } from 'yargs';
interface CreateArgs {
    manifestFile: string;
    codaApiEndpoint: string;
    name?: string;
    description?: string;
}
export declare function handleCreate({ manifestFile, codaApiEndpoint, name, description }: Arguments<CreateArgs>): Promise<void>;
export declare function createPack(manifestFile: string, codaApiEndpoint: string, { name, description }: {
    name?: string;
    description?: string;
}): Promise<never>;
export {};
