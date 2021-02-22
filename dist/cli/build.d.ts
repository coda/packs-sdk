import type { Arguments } from 'yargs';
interface BuildArgs {
    manifestFile: string;
    compiler?: Compiler;
}
declare enum Compiler {
    esbuild = "esbuild",
    webpack = "webpack"
}
export declare function handleBuild({ manifestFile, compiler }: Arguments<BuildArgs>): Promise<void>;
export declare function build(manifestFile: string, compiler?: string): Promise<string>;
export declare function compilePackBundleESBuild(bundleFilename: string, entrypoint: string): Promise<void>;
export {};
