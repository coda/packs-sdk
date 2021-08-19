import type { Arguments } from 'yargs';
import type { TimerShimStrategy } from '../testing/compile';
interface BuildArgs {
    manifestFile: string;
    outputDir?: string;
    minify: boolean;
    timerStrategy: TimerShimStrategy;
}
export declare function handleBuild({ outputDir, manifestFile, minify, timerStrategy }: Arguments<BuildArgs>): Promise<void>;
export declare function build(manifestFile: string): Promise<string>;
export {};
