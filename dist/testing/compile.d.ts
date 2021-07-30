export interface CompilePackBundleOptions {
    bundleFilename?: string;
    manifestPath: string;
    outputDirectory?: string;
    intermediateOutputDirectory?: string;
    sourceMap?: boolean;
    minify?: boolean;
    enableTimers?: boolean;
}
export interface CompilePackBundleResult {
    bundlePath: string;
    bundleSourceMapPath: string;
    intermediateOutputDirectory: string;
}
export declare function compilePackBundle({ bundleFilename, // the output bundle filename
outputDirectory, manifestPath, minify, intermediateOutputDirectory, enableTimers, }: CompilePackBundleOptions): Promise<CompilePackBundleResult>;
