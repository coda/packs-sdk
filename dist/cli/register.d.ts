import type { Arguments } from 'yargs';
interface RegisterArgs {
    apiToken?: string;
    codaApiEndpoint: string;
}
export declare function handleRegister({ apiToken, codaApiEndpoint }: Arguments<RegisterArgs>): Promise<never>;
export {};
