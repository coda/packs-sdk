"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMetadata = exports.handleValidate = void 0;
const compile_1 = require("../testing/compile");
const metadata_1 = require("../helpers/metadata");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("../testing/helpers");
const upload_validation_1 = require("../testing/upload_validation");
async function handleValidate({ manifestFile }) {
    const fullManifestPath = helpers_2.makeManifestFullPath(manifestFile);
    const { bundlePath } = await compile_1.compilePackBundle({ manifestPath: fullManifestPath, minify: false });
    const manifest = await helpers_1.importManifest(bundlePath);
    const metadata = metadata_1.compilePackMetadata(manifest);
    return validateMetadata(metadata);
}
exports.handleValidate = handleValidate;
async function validateMetadata(metadata) {
    var _a;
    try {
        await upload_validation_1.validatePackVersionMetadata(metadata);
    }
    catch (e) {
        const packMetadataValidationError = e;
        const validationErrors = (_a = packMetadataValidationError.validationErrors) === null || _a === void 0 ? void 0 : _a.map(makeErrorMessage).join('\n');
        helpers_3.printAndExit(`${e.message}: \n${validationErrors}`);
    }
}
exports.validateMetadata = validateMetadata;
function makeErrorMessage({ path, message }) {
    if (path) {
        return `Error in field at path "${path}": ${message}`;
    }
    return message;
}
