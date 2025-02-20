import type { ArgumentsCamelCase } from 'yargs';
import type { TimerShimStrategy } from '../testing/compile';
interface BuildArgs {
    manifestFile: string;
    outputDir?: string;
    minify: boolean;
    timerStrategy: TimerShimStrategy;
    intermediateOutputDirectory?: string;
}
export declare function handleBuild({ outputDir, manifestFile, minify, timerStrategy, intermediateOutputDirectory, }: ArgumentsCamelCase<BuildArgs>): Promise<void>;
export declare function build(manifestFile: string, { timerStrategy }?: {
    timerStrategy?: TimerShimStrategy;
}): Promise<string>;
export {};
