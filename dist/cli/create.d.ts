import type { Arguments } from 'yargs';
interface CreateArgs {
    manifestFile: string;
    codaApiEndpoint: string;
}
export declare function handleCreate({ manifestFile, codaApiEndpoint }: Arguments<CreateArgs>): Promise<void>;
export declare function createPack(manifestFile: string, codaApiEndpoint: string): Promise<never>;
export {};
