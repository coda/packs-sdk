"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.handleBuild = void 0;
const compile_1 = require("../testing/compile");
const helpers_1 = require("../testing/helpers");
async function handleBuild({ outputDir, manifestFile, minify, timerStrategy, intermediateOutputDirectory, }) {
    const { bundlePath, intermediateOutputDirectory: actualIntermediateOutputDirectory } = await (0, compile_1.compilePackBundle)({
        manifestPath: manifestFile,
        minify,
        outputDirectory: outputDir,
        timerStrategy,
        intermediateOutputDirectory,
    });
    if (outputDir) {
        (0, helpers_1.print)(`Pack built successfully. Compiled output is in ${bundlePath}. Intermediate files are in ${actualIntermediateOutputDirectory}`);
    }
    else {
        (0, helpers_1.print)(`Pack built successfully. Compiled output is in ${bundlePath}.`);
    }
}
exports.handleBuild = handleBuild;
async function build(manifestFile, { timerStrategy } = {}) {
    const { bundlePath } = await (0, compile_1.compilePackBundle)({
        manifestPath: manifestFile,
        timerStrategy,
    });
    return bundlePath;
}
exports.build = build;
