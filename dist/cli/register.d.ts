import type { ArgumentsCamelCase } from 'yargs';
interface RegisterArgs {
    apiToken?: string;
    apiEndpoint: string;
}
export declare function handleRegister({ apiToken, apiEndpoint }: ArgumentsCamelCase<RegisterArgs>): Promise<never>;
export {};
