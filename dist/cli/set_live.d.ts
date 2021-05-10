import type { Arguments } from 'yargs';
interface SetLiveArgs {
    manifestFile: string;
    packVersion: string;
    codaApiEndpoint: string;
}
export declare function handleSetLive({ manifestFile, packVersion, codaApiEndpoint }: Arguments<SetLiveArgs>): Promise<never>;
export {};
