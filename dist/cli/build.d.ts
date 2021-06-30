import type { Arguments } from 'yargs';
interface BuildArgs {
    manifestFile: string;
    outputDir?: string;
}
export declare function handleBuild({ outputDir, manifestFile }: Arguments<BuildArgs>): Promise<void>;
export declare function build(manifestFile: string): Promise<string>;
export {};
