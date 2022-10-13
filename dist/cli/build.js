import { compilePackBundle } from '../testing/compile';
import { print } from '../testing/helpers';
export async function handleBuild({ outputDir, manifestFile, minify, timerStrategy, intermediateOutputDirectory, }) {
    const { bundlePath, intermediateOutputDirectory: actualIntermediateOutputDirectory } = await compilePackBundle({
        manifestPath: manifestFile,
        minify,
        outputDirectory: outputDir,
        timerStrategy,
        intermediateOutputDirectory,
    });
    if (outputDir) {
        print(`Pack built successfully. Compiled output is in ${bundlePath}. Intermediate files are in ${actualIntermediateOutputDirectory}`);
    }
    else {
        print(`Pack built successfully. Compiled output is in ${bundlePath}.`);
    }
}
export async function build(manifestFile, { timerStrategy } = {}) {
    const { bundlePath } = await compilePackBundle({
        manifestPath: manifestFile,
        timerStrategy,
    });
    return bundlePath;
}
