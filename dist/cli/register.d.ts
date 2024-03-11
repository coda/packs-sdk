import type { ArgumentsCamelCase } from 'yargs';
interface RegisterArgs {
    apiToken?: string;
    codaApiEndpoint: string;
}
export declare function handleRegister({ apiToken, codaApiEndpoint }: ArgumentsCamelCase<RegisterArgs>): Promise<never>;
export {};
