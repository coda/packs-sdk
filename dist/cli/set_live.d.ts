import type { Arguments } from 'yargs';
interface SetLiveArgs {
    packId: number;
    packVersion: string;
    codaApiEndpoint: string;
}
export declare function handleSetLive({ packId, packVersion, codaApiEndpoint }: Arguments<SetLiveArgs>): Promise<void>;
export {};
