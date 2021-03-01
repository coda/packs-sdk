import type { Arguments } from 'yargs';
interface CreateArgs {
    packName: string;
    dev?: boolean;
}
export interface AllPacks {
    [name: string]: number;
}
export declare function handleCreate({ packName, dev }: Arguments<CreateArgs>): Promise<void>;
export declare function createPack(packName: string, dev?: boolean): Promise<void>;
export declare function storePack(packName: string, packId: number): void;
export declare function readPacksFile(): AllPacks | undefined;
export {};
