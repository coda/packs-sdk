import type { Arguments } from 'yargs';
interface RegisterArgs {
    apiToken?: string;
}
export declare function handleRegister({ apiToken }: Arguments<RegisterArgs>): Promise<undefined>;
export {};
