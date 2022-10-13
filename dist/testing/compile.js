import browserify from 'browserify';
import { ensureUnreachable } from '../helpers/ensure';
import * as esbuild from 'esbuild';
import exorcist from 'exorcist';
import fs from 'fs';
import { getPackOptions } from '../cli/config_storage';
import os from 'os';
import path from 'path';
import { processVmError } from './helpers';
import semver from 'semver';
import { tryGetIvm } from './ivm_wrapper';
import uglify from 'uglify-js';
import { v4 } from 'uuid';
export var TimerShimStrategy;
(function (TimerShimStrategy) {
    TimerShimStrategy["None"] = "none";
    TimerShimStrategy["Error"] = "error";
    TimerShimStrategy["Fake"] = "fake";
})(TimerShimStrategy || (TimerShimStrategy = {}));
async function loadIntoVM(bundlePath) {
    const ivm = tryGetIvm();
    if (!ivm) {
        return;
    }
    const bundle = fs.readFileSync(bundlePath);
    const isolate = new ivm.Isolate({ memoryLimit: 128 });
    const ivmContext = await isolate.createContext();
    // Setup the global object.
    const jail = ivmContext.global;
    await jail.set('global', jail.derefInto());
    await jail.set('exports', {}, { copy: true });
    await jail.set('codaInternal', { serializer: {} }, { copy: true });
    const script = await isolate.compileScript(bundle.toString(), { filename: bundlePath });
    await script.run(ivmContext);
}
async function browserifyBundle({ lastBundleFilename, outputBundleFilename, options, }) {
    // browserify doesn't minify by default. if necessary another pipe can be created to minify the output.
    const browserifyCompiler = browserify(lastBundleFilename, {
        debug: true,
        standalone: 'exports',
    });
    const writer = fs.createWriteStream(outputBundleFilename);
    const compiledStream = browserifyCompiler.bundle();
    return new Promise(resolve => {
        compiledStream
            .pipe(exorcist(`${outputBundleFilename}.map`, undefined, `${process.cwd()}/`, options.intermediateOutputDirectory))
            .pipe(writer);
        writer.on('finish', () => {
            resolve(undefined);
        });
    });
}
async function uglifyBundle({ lastBundleFilename, outputBundleFilename, }) {
    const sourcemap = JSON.parse(fs.readFileSync(`${lastBundleFilename}.map`).toString());
    const uglifyOutput = uglify.minify(fs.readFileSync(lastBundleFilename).toString(), {
        sourceMap: {
            url: `${outputBundleFilename}.map`,
            content: sourcemap,
            includeSources: true,
        },
    });
    if (uglifyOutput.error) {
        throw uglifyOutput.error;
    }
    if (uglifyOutput.warnings) {
        // eslint-disable-next-line no-console
        console.warn(uglifyOutput.warnings);
    }
    fs.writeFileSync(outputBundleFilename, uglifyOutput.code);
    fs.writeFileSync(`${outputBundleFilename}.map`, uglifyOutput.map);
}
function getTimerShims(timerStrategy) {
    switch (timerStrategy) {
        case TimerShimStrategy.None:
            return [];
        case TimerShimStrategy.Fake:
            return [`${__dirname}/injections/timers_shim.js`];
        case TimerShimStrategy.Error:
            return [`${__dirname}/injections/timers_disabled_shim.js`];
        default:
            ensureUnreachable(timerStrategy);
    }
}
function getInjections({ timerStrategy = TimerShimStrategy.None, manifestPath }) {
    const options = getPackOptions(path.dirname(manifestPath));
    const timerStrategyToUse = (options === null || options === void 0 ? void 0 : options.timerStrategy) || timerStrategy;
    const shims = [...getTimerShims(timerStrategyToUse), `${__dirname}/injections/crypto_shim.js`];
    return shims;
}
async function buildWithES({ lastBundleFilename, outputBundleFilename, options: buildOptions, format, }) {
    const options = {
        banner: { js: "'use strict';" },
        bundle: true,
        entryPoints: [lastBundleFilename],
        outfile: outputBundleFilename,
        format,
        // This is tricky.
        // - cjs bundles are adding exports to global.exports.
        // - if iife bundles add exports to global, require() doesn't work. only module.exports works. idk why.
        globalName: format === 'iife' ? 'module.exports' : undefined,
        // Set target to 'node' to allow pack to use node utils. These node utils will however
        // be later browserified.
        platform: 'node',
        // isolated-vm environment is approximately es2020. It's known that es2021 will break because of
        // logical assignment
        target: 'ES2020',
        inject: getInjections(buildOptions),
        minify: false,
        sourcemap: 'both',
        keepNames: true,
        // The pack bundle is always targeting the isolated-vm environment.
        define: { 'process.env.IN_ISOLATED_VM_OR_BROWSER': 'true' },
        external: ['codaInternal'], // for serializer
    };
    // https://zchee.github.io/golang-wiki/MinimumRequirements/ says macOS High Sierra 10.13 or newer
    // https://en.wikipedia.org/wiki/MacOS says OS X 10.13 corresponds to Darwin kernel version 17
    const minDarwinVersionSupportedByGo = '17.0.0';
    if (os.platform() === 'darwin' && semver.lt(os.release(), minDarwinVersionSupportedByGo)) {
        // The error message if you try to run esbuild (or any Go binary) on an old OS X version
        // is not particularly helpful (https://github.com/golang/go/issues/52757):
        // "dyld: Symbol not found: _SecTrustEvaluateWithError"
        //
        // Here we preemptively throw an error with a clearer, more actionable message.
        throw new Error('Packs SDK requires OS X version 10.13 or later');
    }
    await esbuild.build(options);
}
export async function compilePackBundle({ bundleFilename = 'bundle.js', // the output bundle filename
outputDirectory, manifestPath, minify = true, intermediateOutputDirectory, timerStrategy = TimerShimStrategy.None, }) {
    const esbuildBundleFilename = 'esbuild-bundle.js';
    const browserifyBundleFilename = 'browserify-bundle.js';
    const browserifyWithShimBundleFilename = 'browserify-with-shim-bundle.js';
    const uglifyBundleFilename = 'uglify-bundle.js';
    if (!intermediateOutputDirectory) {
        intermediateOutputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), `coda-packs-${v4()}`));
    }
    const options = {
        bundleFilename,
        outputDirectory,
        manifestPath,
        minify,
        intermediateOutputDirectory,
        timerStrategy,
    };
    const buildChain = [
        // this bundles the pack and compiles ts to js (need by browserify).
        // browserify only recognizes cjs format.
        { builder: options => buildWithES({ ...options, format: 'cjs' }), outputFilename: esbuildBundleFilename },
        // this browserify node libraries.
        { builder: browserifyBundle, outputFilename: browserifyBundleFilename },
        // run esbuild again to inject shim to new symbols added by browserify.
        //
        // also change to iife format here to avoid leaking symbols into global in ivm.
        // - in NodeJS, require(someModule) is executed in a closure where no local symbols will leak.
        // - in isolated-vm, however everything is evaluated in the global context and all local variables will leak.
        //
        // we used to manually create a closure (e.g. `(() => { ${bundle} })()` ) when loading code into isolated-vm
        // but that breaks sourcemap (esp if it's minified)
        { builder: options => buildWithES({ ...options, format: 'iife' }), outputFilename: browserifyWithShimBundleFilename },
    ];
    if (minify) {
        buildChain.push({ builder: uglifyBundle, outputFilename: uglifyBundleFilename });
    }
    // let the last step of the chain use bundleFilename for output name so that we don't need to
    // apply another step to rename the filenames in sourcemap.
    buildChain[buildChain.length - 1].outputFilename = bundleFilename;
    let filename = path.resolve(manifestPath);
    for (const { builder, outputFilename } of buildChain) {
        const outputBundleFilename = path.join(intermediateOutputDirectory, outputFilename);
        await builder({
            lastBundleFilename: filename,
            outputBundleFilename,
            options,
        });
        filename = outputBundleFilename;
    }
    const tempBundlePath = filename;
    // test if it can be loaded into isolated-vm.
    // among all the packs. Google Drive (1059) won't load into IVM at this moment since it requires jimp
    // which uses gifcodec, which calls process.nextTick on the global level.
    // maybe we just need to get rid of jimp and resize-optimize-images instead.
    try {
        await loadIntoVM(tempBundlePath);
    }
    catch (err) {
        throw await processVmError(err, tempBundlePath);
    }
    if (!outputDirectory || outputDirectory === intermediateOutputDirectory) {
        return {
            bundlePath: tempBundlePath,
            intermediateOutputDirectory,
            bundleSourceMapPath: `${tempBundlePath}.map`,
        };
    }
    const bundlePath = path.join(outputDirectory, bundleFilename);
    const bundleSourceMapPath = `${bundlePath}.map`;
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }
    // move over finally compiled bundle & sourcemap to the target directory.
    fs.copyFileSync(tempBundlePath, bundlePath);
    fs.copyFileSync(`${tempBundlePath}.map`, bundleSourceMapPath);
    return {
        intermediateOutputDirectory,
        bundlePath,
        bundleSourceMapPath,
    };
}
