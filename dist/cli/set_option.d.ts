import type { Arguments } from 'yargs';
interface SetOptionArgs {
    manifestFile: string;
    option: string;
    value: string;
}
export declare function handleSetOption({ manifestFile, option, value }: Arguments<SetOptionArgs>): Promise<void>;
export {};
