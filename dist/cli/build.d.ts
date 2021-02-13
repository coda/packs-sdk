import type { Arguments } from 'yargs';
interface BuildArgs {
    manifestFile: string;
}
export declare function handleBuild({ manifestFile }: Arguments<BuildArgs>): Promise<void>;
export {};
