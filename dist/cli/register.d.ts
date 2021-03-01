import type { Arguments } from 'yargs';
interface RegisterArgs {
    apiToken?: string;
    dev?: boolean;
}
export declare function handleRegister({ apiToken, dev }: Arguments<RegisterArgs>): Promise<undefined>;
export {};
