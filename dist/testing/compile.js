"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.compilePackBundle = void 0;
const browserify_1 = __importDefault(require("browserify"));
const esbuild = __importStar(require("esbuild"));
const exorcist_1 = __importDefault(require("exorcist"));
const fs_1 = __importDefault(require("fs"));
const isolated_vm_1 = __importDefault(require("isolated-vm"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const uglify_js_1 = __importDefault(require("uglify-js"));
const uuid_1 = require("uuid");
async function loadIntoVM(bundlePath) {
    const bundle = fs_1.default.readFileSync(bundlePath);
    const isolate = new isolated_vm_1.default.Isolate({ memoryLimit: 128 });
    const ivmContext = await isolate.createContext();
    // Setup the global object.
    const jail = ivmContext.global;
    await jail.set('global', jail.derefInto());
    await jail.set('exports', {}, { copy: true });
    const script = await isolate.compileScript(bundle.toString());
    await script.run(ivmContext);
}
async function browserifyBundle({ outputDirectory, lastBundleFilename, outputBundleFilename, }) {
    // browserify doesn't minify by default. if necessary another pipe can be created to minify the output.
    const browserifyCompiler = browserify_1.default(path_1.default.join(outputDirectory, lastBundleFilename), {
        debug: true,
        standalone: 'exports',
    });
    const writer = fs_1.default.createWriteStream(path_1.default.join(outputDirectory, outputBundleFilename));
    const compiledStream = browserifyCompiler.bundle();
    return new Promise(resolve => {
        compiledStream
            .pipe(exorcist_1.default(`${path_1.default.join(outputDirectory, outputBundleFilename)}.map`, undefined, `${process.cwd()}/`, outputDirectory))
            .pipe(writer);
        writer.on('finish', () => {
            resolve(undefined);
        });
    });
}
async function uglifyBundle({ outputDirectory, lastBundleFilename, outputBundleFilename, }) {
    const sourcemap = JSON.parse(fs_1.default.readFileSync(`${path_1.default.join(outputDirectory, lastBundleFilename)}.map`).toString());
    const uglifyOutput = uglify_js_1.default.minify(fs_1.default.readFileSync(path_1.default.join(outputDirectory, lastBundleFilename)).toString(), {
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
    fs_1.default.writeFileSync(path_1.default.join(outputDirectory, outputBundleFilename), uglifyOutput.code);
    fs_1.default.writeFileSync(path_1.default.join(outputDirectory, `${outputBundleFilename}.map`), uglifyOutput.map);
}
async function buildWithES({ manifestPath, outputDirectory, outputBundleFilename, }) {
    const options = {
        banner: { js: "'use strict';" },
        bundle: true,
        entryPoints: [manifestPath],
        outfile: path_1.default.join(outputDirectory, outputBundleFilename),
        format: 'cjs',
        platform: 'node',
        minify: false,
        sourcemap: 'both',
    };
    await esbuild.build(options);
}
async function compilePackBundle({ bundleFilename = 'bundle.js', // the output bundle filename
outputDirectory, manifestPath, minify = true, intermediateOutputDirectory, }) {
    const nodeBundleFilename = 'node-bundle.js';
    const browserifyBundleFilename = 'browserify-bundle.js';
    if (!intermediateOutputDirectory) {
        intermediateOutputDirectory = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), `coda-packs-${uuid_1.v4()}`));
    }
    // TODO(huayang): esbuild may not be necessary here since we use browserify to bundle it anyway.
    await buildWithES({
        manifestPath,
        outputDirectory: intermediateOutputDirectory,
        outputBundleFilename: nodeBundleFilename,
    });
    if (minify) {
        await browserifyBundle({
            outputDirectory: intermediateOutputDirectory,
            lastBundleFilename: nodeBundleFilename,
            outputBundleFilename: browserifyBundleFilename,
        });
        await uglifyBundle({
            outputDirectory: intermediateOutputDirectory,
            outputBundleFilename: bundleFilename,
            lastBundleFilename: browserifyBundleFilename,
        });
    }
    else {
        await browserifyBundle({
            outputDirectory: intermediateOutputDirectory,
            lastBundleFilename: nodeBundleFilename,
            outputBundleFilename: bundleFilename,
        });
    }
    const tempBundlePath = path_1.default.join(intermediateOutputDirectory, bundleFilename);
    // test if it can be loaded into isolated-vm.
    // among all the packs. Google Drive (1059) won't load into IVM at this moment since it requires jimp
    // which uses gifcodec, which calls process.nextTick on the global level.
    // maybe we just need to get rid of jimp and resize-optimize-images instead.
    await loadIntoVM(tempBundlePath);
    if (!outputDirectory || outputDirectory === intermediateOutputDirectory) {
        return {
            bundlePath: path_1.default.join(intermediateOutputDirectory, bundleFilename),
            intermediateOutputDirectory,
            bundleSourceMapPath: path_1.default.join(intermediateOutputDirectory, `${bundleFilename}.map`),
        };
    }
    const bundlePath = path_1.default.join(outputDirectory, bundleFilename);
    const bundleSourceMapPath = `${bundlePath}.map`;
    if (!fs_1.default.existsSync(outputDirectory)) {
        fs_1.default.mkdirSync(outputDirectory, { recursive: true });
    }
    // move over finally compiled bundle & sourcemap to the target directory.
    fs_1.default.copyFileSync(tempBundlePath, bundlePath);
    fs_1.default.copyFileSync(`${tempBundlePath}.map`, bundleSourceMapPath);
    return {
        intermediateOutputDirectory,
        bundlePath,
        bundleSourceMapPath,
    };
}
exports.compilePackBundle = compilePackBundle;
