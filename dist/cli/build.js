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
const esbuild = __importStar(require("esbuild"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../testing/helpers");
async function handleBuild({ manifestFile }) {
    const builtFilename = await build(manifestFile);
    helpers_1.print(`Pack built successfully. Compiled output is in ${builtFilename}`);
}
exports.handleBuild = handleBuild;
async function build(manifestFile) {
    const tempDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), 'coda-packs-'));
    const bundleFilename = path_1.default.join(tempDir, `bundle.js`);
    await compilePackBundleESBuild(bundleFilename, manifestFile);
    return bundleFilename;
}
exports.build = build;
async function compilePackBundleESBuild(bundleFilename, entrypoint) {
    const options = {
        banner: { js: "'use strict';" },
        bundle: true,
        entryPoints: [entrypoint],
        outfile: bundleFilename,
        format: 'cjs',
        minify: false,
    };
    await esbuild.build(options);
}
exports.compilePackBundleESBuild = compilePackBundleESBuild;
