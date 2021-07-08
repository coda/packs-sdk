import type { Arguments } from 'yargs';
interface UpdateConfigArgs {
    manifestFile: string;
    codaApiEndpoint: string;
}
export declare function handleUpdateConfig({}: Arguments<UpdateConfigArgs>): Promise<void>;
export {};
