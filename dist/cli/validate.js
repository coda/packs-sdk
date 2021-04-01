"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMetadata = exports.handleValidate = void 0;
async function handleValidate({ manifestFile }) {
    return validateMetadata(manifestFile);
}
exports.handleValidate = handleValidate;
async function validateMetadata(_manifestFile) {
    // const {manifest} = await import(manifestFile);
    try {
        // await validatePackMetadata(manifest);
    }
    catch (e) {
        // const packMetadataValidationError = e as PackMetadataValidationError;
        // const validationErrors = packMetadataValidationError.validationErrors?.map(error => error.message).join('\n');
        // printAndExit(`${e.message}: \n${validationErrors}`);
    }
}
exports.validateMetadata = validateMetadata;
