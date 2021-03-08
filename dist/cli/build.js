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
exports.compilePackBundleESBuild = exports.build = exports.handleBuild = void 0;
const logging_1 = require("../helpers/logging");
const esbuild = __importStar(require("esbuild"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const webpack_1 = __importDefault(require("webpack"));
var Compiler;
(function (Compiler) {
    Compiler["esbuild"] = "esbuild";
    Compiler["webpack"] = "webpack";
})(Compiler || (Compiler = {}));
async function handleBuild({ manifestFile, compiler }) {
    await build(manifestFile, compiler);
}
exports.handleBuild = handleBuild;
async function build(manifestFile, compiler) {
    // TODO(alan): surface more helpful error messages when import manifestFile fails.
    const { manifest } = await Promise.resolve().then(() => __importStar(require(manifestFile)));
    const tempDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), 'coda-packs-'));
    const bundleFilename = path_1.default.join(tempDir, `bundle-${manifest.id}-${manifest.version}.js`);
    const logger = new logging_1.ConsoleLogger();
    switch (compiler) {
        case Compiler.webpack:
            await compilePackBundleWebpack(bundleFilename, manifestFile, logger);
            break;
        case Compiler.esbuild:
        default:
            await compilePackBundleESBuild(bundleFilename, manifestFile);
    }
    return bundleFilename;
}
exports.build = build;
async function compilePackBundleESBuild(bundleFilename, entrypoint) {
    const options = {
        banner: "'use strict';",
        bundle: true,
        entryPoints: [entrypoint],
        outfile: bundleFilename,
        platform: 'node',
        minify: true,
    };
    await esbuild.build(options);
}
exports.compilePackBundleESBuild = compilePackBundleESBuild;
async function compilePackBundleWebpack(bundleFilename, entrypoint, logger) {
    logger.info(`... Bundle -> ${bundleFilename}`);
    const config = {
        devtool: 'source-map',
        entry: entrypoint,
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.[tj]s$/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                },
            ],
        },
        name: 'PackBundle',
        node: false,
        output: {
            path: path_1.default.dirname(bundleFilename),
            filename: path_1.default.basename(bundleFilename),
            libraryTarget: 'commonjs2',
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        target: 'async-node',
    };
    const compiler = webpack_1.default(config);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                logger.warn(err.stack || err.message || err.toString());
                return reject(err);
            }
            return resolve(stats);
        });
    });
}
