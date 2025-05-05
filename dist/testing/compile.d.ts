export interface CompilePackBundleOptions {
    bundleFilename?: string;
    codaApiEndpoint?: string;
    manifestPath: string;
    outputDirectory?: string;
    intermediateOutputDirectory?: string;
    sourceMap?: boolean;
    minify?: boolean;
    timerStrategy?: TimerShimStrategy;
}
export declare enum TimerShimStrategy {
    None = "none",
    Error = "error",
    Fake = "fake"
}
export interface CompilePackBundleResult {
    bundlePath: string;
    bundleSourceMapPath: string;
    intermediateOutputDirectory: string;
}
export declare function compilePackBundle({ bundleFilename, // the output bundle filename
codaApiEndpoint, outputDirectory, manifestPath, minify, intermediateOutputDirectory, timerStrategy, }: CompilePackBundleOptions): Promise<CompilePackBundleResult>;
