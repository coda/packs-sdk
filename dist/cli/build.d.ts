import type { Arguments } from 'yargs';
interface BuildArgs {
    manifestFile: string;
    outputDir?: string;
    minify: boolean;
    timers: boolean;
}
export declare function handleBuild({ outputDir, manifestFile, minify, timers }: Arguments<BuildArgs>): Promise<void>;
export declare function build(manifestFile: string): Promise<string>;
export {};
