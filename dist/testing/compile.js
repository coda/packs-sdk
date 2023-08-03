"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compilePackBundle = exports.TimerShimStrategy = void 0;
const browserify_1 = __importDefault(require("browserify"));
const metadata_1 = require("../helpers/metadata");
const ensure_1 = require("../helpers/ensure");
const esbuild = __importStar(require("esbuild"));
const exorcist_1 = __importDefault(require("exorcist"));
const fs_1 = __importDefault(require("fs"));
const config_storage_1 = require("../cli/config_storage");
const helpers_1 = require("../cli/helpers");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const helpers_2 = require("./helpers");
const semver_1 = __importDefault(require("semver"));
const ivm_wrapper_1 = require("./ivm_wrapper");
const uglify_js_1 = __importDefault(require("uglify-js"));
const uuid_1 = require("uuid");
var TimerShimStrategy;
(function (TimerShimStrategy) {
    TimerShimStrategy["None"] = "none";
    TimerShimStrategy["Error"] = "error";
    TimerShimStrategy["Fake"] = "fake";
})(TimerShimStrategy || (exports.TimerShimStrategy = TimerShimStrategy = {}));
async function loadIntoVM(bundlePath) {
    const ivm = (0, ivm_wrapper_1.tryGetIvm)();
    if (!ivm) {
        return;
    }
    const bundle = fs_1.default.readFileSync(bundlePath);
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
    const browserifyCompiler = (0, browserify_1.default)(lastBundleFilename, {
        debug: true,
        standalone: 'exports',
    });
    const writer = fs_1.default.createWriteStream(outputBundleFilename);
    const compiledStream = browserifyCompiler.bundle();
    return new Promise(resolve => {
        compiledStream
            .pipe((0, exorcist_1.default)(`${outputBundleFilename}.map`, undefined, `${process.cwd()}/`, options.intermediateOutputDirectory))
            .pipe(writer);
        writer.on('finish', () => {
            resolve(undefined);
        });
    });
}
async function uglifyBundle({ lastBundleFilename, outputBundleFilename, }) {
    const sourcemap = JSON.parse(fs_1.default.readFileSync(`${lastBundleFilename}.map`).toString());
    const uglifyOutput = uglify_js_1.default.minify(fs_1.default.readFileSync(lastBundleFilename).toString(), {
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
    fs_1.default.writeFileSync(outputBundleFilename, uglifyOutput.code);
    fs_1.default.writeFileSync(`${outputBundleFilename}.map`, uglifyOutput.map);
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
            (0, ensure_1.ensureUnreachable)(timerStrategy);
    }
}
function getInjections({ timerStrategy = TimerShimStrategy.None, manifestPath }) {
    const options = (0, config_storage_1.getPackOptions)(path_1.default.dirname(manifestPath));
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
    if (os_1.default.platform() === 'darwin' && semver_1.default.lt(os_1.default.release(), minDarwinVersionSupportedByGo)) {
        // The error message if you try to run esbuild (or any Go binary) on an old OS X version
        // is not particularly helpful (https://github.com/golang/go/issues/52757):
        // "dyld: Symbol not found: _SecTrustEvaluateWithError"
        //
        // Here we preemptively throw an error with a clearer, more actionable message.
        throw new Error('Packs SDK requires OS X version 10.13 or later');
    }
    await esbuild.build(options);
}
async function compilePackBundle({ bundleFilename = 'bundle.js', // the output bundle filename
outputDirectory, manifestPath, minify = true, intermediateOutputDirectory, timerStrategy = TimerShimStrategy.None, }) {
    const esbuildBundleFilename = 'esbuild-bundle.js';
    const browserifyBundleFilename = 'browserify-bundle.js';
    const browserifyWithShimBundleFilename = 'browserify-with-shim-bundle.js';
    const uglifyBundleFilename = 'uglify-bundle.js';
    if (!intermediateOutputDirectory) {
        intermediateOutputDirectory = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), `coda-packs-${(0, uuid_1.v4)()}`));
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
    let filename = path_1.default.resolve(manifestPath);
    for (const { builder, outputFilename } of buildChain) {
        const outputBundleFilename = path_1.default.join(intermediateOutputDirectory, outputFilename);
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
        throw await (0, helpers_2.processVmError)(err, tempBundlePath);
    }
    // Write the generated metadata. It's not used by the upload command, but
    // it's helpful for debugging upload validation errors.
    const manifest = await (0, helpers_1.importManifest)(tempBundlePath);
    const metadata = (0, metadata_1.compilePackMetadata)(manifest);
    const tempMetadataPath = path_1.default.join(intermediateOutputDirectory, 'metadata.json');
    fs_1.default.writeFileSync(tempMetadataPath, JSON.stringify(metadata));
    if (!outputDirectory || outputDirectory === intermediateOutputDirectory) {
        return {
            bundlePath: tempBundlePath,
            intermediateOutputDirectory,
            bundleSourceMapPath: `${tempBundlePath}.map`,
        };
    }
    const bundlePath = path_1.default.join(outputDirectory, bundleFilename);
    const bundleSourceMapPath = `${bundlePath}.map`;
    const metadataPath = path_1.default.join(outputDirectory, 'metadata.json');
    if (!fs_1.default.existsSync(outputDirectory)) {
        fs_1.default.mkdirSync(outputDirectory, { recursive: true });
    }
    // move over finally compiled bundle & sourcemap to the target directory.
    fs_1.default.copyFileSync(tempBundlePath, bundlePath);
    fs_1.default.copyFileSync(tempMetadataPath, metadataPath);
    fs_1.default.copyFileSync(`${tempBundlePath}.map`, bundleSourceMapPath);
    return {
        intermediateOutputDirectory,
        bundlePath,
        bundleSourceMapPath,
    };
}
exports.compilePackBundle = compilePackBundle;
