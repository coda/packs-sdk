import type { Arguments } from 'yargs';
interface PublishArgs {
    manifestFile: string;
    codaApiEndpoint: string;
}
export declare function handlePublish({ manifestFile, codaApiEndpoint }: Arguments<PublishArgs>): Promise<undefined>;
export {};
