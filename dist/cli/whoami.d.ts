import type { ArgumentsCamelCase } from 'yargs';
interface WhoamiArgs {
    apiToken?: string;
    codaApiEndpoint: string;
}
export declare function handleWhoami({ apiToken, codaApiEndpoint }: ArgumentsCamelCase<WhoamiArgs>): Promise<never>;
export {};
