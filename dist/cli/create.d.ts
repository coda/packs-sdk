import type { Arguments } from 'yargs';
interface CreateArgs {
    packName: string;
    codaApiEndpoint: string;
}
export interface AllPacks {
    [name: string]: number;
}
export declare function handleCreate({ packName, codaApiEndpoint }: Arguments<CreateArgs>): Promise<void>;
export declare function createPack(packName: string, codaApiEndpoint: string): Promise<void>;
export declare function storePack(packName: string, packId: number): void;
export declare function readPacksFile(): AllPacks | undefined;
export {};
