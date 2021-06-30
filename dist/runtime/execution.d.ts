export declare function translateErrorStackFromVM({ stacktrace, bundleSourceMapPath, vmFilename, }: {
    stacktrace?: string;
    bundleSourceMapPath: string;
    vmFilename: string;
}): Promise<string | undefined>;
