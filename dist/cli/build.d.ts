import type { Arguments } from 'yargs';
interface BuildArgs {
    manifestFile: string;
    outputDir?: string;
    minify: boolean;
    timers: boolean;
    bundleFilename?: string;
    intermediateOutputDirectory?: string;
}
export declare function handleBuild({ bundleFilename, intermediateOutputDirectory: intermediateOutputDirectoryInput, outputDir, manifestFile, minify, timers, }: Arguments<BuildArgs>): Promise<void>;
export declare function build(manifestFile: string): Promise<string>;
export {};
