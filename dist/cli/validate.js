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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMetadata = exports.handleValidate = void 0;
const compile_1 = require("../testing/compile");
const metadata_1 = require("../helpers/metadata");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("../testing/helpers");
const upload_validation_1 = require("../testing/upload_validation");
async function handleValidate({ manifestFile, checkDeprecationWarnings }) {
    const fullManifestPath = (0, helpers_3.makeManifestFullPath)(manifestFile);
    const { bundlePath } = await (0, compile_1.compilePackBundle)({ manifestPath: fullManifestPath, minify: false });
    const manifest = await (0, helpers_1.importManifest)(bundlePath);
    // Since it's okay to not specify a version, we inject one if it's not provided.
    if (!manifest.version) {
        manifest.version = '1';
    }
    const metadata = (0, metadata_1.compilePackMetadata)(manifest);
    return validateMetadata(metadata, { checkDeprecationWarnings });
}
exports.handleValidate = handleValidate;
async function validateMetadata(metadata, { checkDeprecationWarnings = true } = {}) {
    var _a, _b;
    // Since package.json isn't in dist, we grab it from the root directory instead.
    const packageJson = await Promise.resolve(`${(0, helpers_2.isTestCommand)() ? '../package.json' : '../../package.json'}`).then(s => __importStar(require(s)));
    const codaPacksSDKVersion = packageJson.version;
    try {
        await (0, upload_validation_1.validatePackVersionMetadata)(metadata, codaPacksSDKVersion);
    }
    catch (e) {
        const packMetadataValidationError = e;
        const validationErrors = (_a = packMetadataValidationError.validationErrors) === null || _a === void 0 ? void 0 : _a.map(makeErrorMessage).join('\n');
        (0, helpers_4.printAndExit)(`${e.message}: \n${validationErrors}`);
    }
    if (!checkDeprecationWarnings) {
        return;
    }
    try {
        await (0, upload_validation_1.validatePackVersionMetadata)(metadata, codaPacksSDKVersion, { warningMode: true });
    }
    catch (e) {
        const packMetadataValidationError = e;
        const deprecationWarnings = (_b = packMetadataValidationError.validationErrors) === null || _b === void 0 ? void 0 : _b.map(makeWarningMessage).join('\n');
        (0, helpers_4.printAndExit)(`Your Pack is using deprecated properties or features: \n${deprecationWarnings}`, 0);
    }
}
exports.validateMetadata = validateMetadata;
function makeErrorMessage({ path, message }) {
    if (path) {
        return `Error in field at path "${path}": ${message}`;
    }
    return message;
}
function makeWarningMessage({ path, message }) {
    if (path) {
        return `Warning in field at path "${path}": ${message} This will become an error in a future SDK version.`;
    }
    return message;
}
