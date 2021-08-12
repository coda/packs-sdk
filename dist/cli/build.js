"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.handleBuild = void 0;
const compile_1 = require("../testing/compile");
const helpers_1 = require("../testing/helpers");
async function handleBuild({ outputDir, manifestFile, minify, timerStrategy }) {
    const { bundlePath, intermediateOutputDirectory } = await compile_1.compilePackBundle({
        manifestPath: manifestFile,
        minify,
        outputDirectory: outputDir,
        timerStrategy,
    });
    if (outputDir) {
        helpers_1.print(`Pack built successfully. Compiled output is in ${bundlePath}. Intermediate files are in ${intermediateOutputDirectory}`);
    }
    else {
        helpers_1.print(`Pack built successfully. Compiled output is in ${bundlePath}.`);
    }
}
exports.handleBuild = handleBuild;
async function build(manifestFile) {
    const { bundlePath } = await compile_1.compilePackBundle({
        manifestPath: manifestFile,
    });
    return bundlePath;
}
exports.build = build;
