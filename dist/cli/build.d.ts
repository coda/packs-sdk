import type { Arguments } from 'yargs';
interface BuildArgs {
    manifestFile: string;
}
export declare function handleBuild({ manifestFile }: Arguments<BuildArgs>): Promise<void>;
export declare function build(manifestFile: string): Promise<string>;
export declare function compilePackBundleESBuild(bundleFilename: string, entrypoint: string): Promise<void>;
export {};
