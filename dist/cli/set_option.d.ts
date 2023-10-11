import type { ArgumentsCamelCase } from 'yargs';
interface SetOptionArgs {
    manifestFile: string;
    option: string;
    value: string;
}
export declare function handleSetOption({ manifestFile, option, value }: ArgumentsCamelCase<SetOptionArgs>): Promise<void>;
export {};
